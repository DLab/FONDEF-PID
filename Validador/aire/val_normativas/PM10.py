from concentraciones import promedios_dia, concentracion_mensual, concentracion_anual
import pandas as pd
import numpy as np
    
def normaPM10_promedio_diario(df):
    """
    Entrada: df(dataframe): fecha(datetime), UfId(int), ProcesoId(int), parametro(str), valor(float)
    Salida: result(dataframe): año(Period), UfId(int), ProcesoId(int), dias_sobrepasados(int), dias_cuentaAhorro(int)
    """
    
    percentil98_año = 7
    limite = 130
    
    df = (df
        .loc[df['parametro'] == 'PM10'].copy()
        .pipe(promedios_dia))
    
    df['año'] = df['dia'].dt.year
    
    # Filtrar dias sobre 50
    df_sobre_50 = df[df['valor'] > limite].copy()
    
    # Contar el número de días sobrepasados por año, UfId y ProcesoId
    result = df_sobre_50.groupby(['año', 'UfId', 'ProcesoId']).size().reset_index(name='dias_sobrepasados')
    
    # Calcular la "cuenta de ahorro" y asegurarse de que no sea negativa
    result['dias_cuentaAhorro'] = np.clip(percentil98_año - result['dias_sobrepasados'], 0, None)
    
    return result


def normaPM10_promedio_trianual(df:pd.DataFrame)-> pd.DataFrame:
    """
    Entrada: df(dataframe): fecha(datetime), UfId(int), ProcesoId(int), parametro(str), valor(float)
    Salida: result(dataframe): UfId(int), promedio_trianual(float), norma_sobrepasada(Boolean)
    """
    
    limite = 50
    
    df = ( 
          df.copy()
            .loc[df['parametro'] == 'PM10']
            .pipe(promedios_dia)
            .pipe(concentracion_mensual)
            .pipe(concentracion_anual)
            .groupby(['UfId','año'], as_index=False)
            .agg(valor=('valor', 'mean'))
          )
    
    # Calcular promedio trianual
    df['promedio_trianual'] = (
        df.sort_values(by='año')
        .groupby('UfId')['valor']
        .rolling(window=3)
        .mean()
        .reset_index(level=0, drop=True)
    )
    
    df['norma_sobrepasada'] = df['promedio_trianual'] > limite
    
    return df