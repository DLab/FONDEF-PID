from concentraciones import promedios_dia, concentracion_mensual, concentracion_anual
import pandas as pd
import numpy as np

#MATERIAL PARTICULADO 2.5


"""
(Material Particulado 2.5 | D.S. 12/2011 | https://www.bcn.cl/leychile/navegar?idNorma=1025202)

Promedio diario: Cuando el percentil 98 de los promedios diarios registrados durante un año, 
sea mayor a 50 μg/m3, en cualquier estación monitora calificada como EMRP.
"""
    
def normaPM25_promedio_diario(df):
    """
    Entrada: df(dataframe): fecha(datetime), UfId(int), ProcesoId(int), parametro(str), valor(float)
    Salida: result(dataframe): año(Period), UfId(int), ProcesoId(int), dias_sobrepasados(int), dias_cuentaAhorro(int)
    """
    
    #Valores hardcodeados en la norma, asi que hardcodearlos en el codigo tiene sentido creo
    percentil98_año = 7
    limite = 50
    
    df = (df
        .loc[df['parametro'] == 'PM25'].copy()
        .pipe(promedios_dia))
    
    df['año'] = df['dia'].dt.year
    
    # Filtrar dias sobre 50
    df_sobre_50 = df[df['valor'] > limite].copy()
    
    # Contar el número de días sobrepasados por año, UfId y ProcesoId
    result = df_sobre_50.groupby(['año', 'UfId', 'ProcesoId']).size().reset_index(name='dias_sobrepasados')
    
    # Calcular la "cuenta de ahorro" y asegurarse de que no sea negativa
    result['dias_cuentaAhorro'] = np.clip(percentil98_año - result['dias_sobrepasados'], 0, None)
    
    return result


"""
Promedio trianual: Cuando el promedio tri-anual de las concentraciones anuales sea mayor a 20 µg/m3,
en cualquier estación monitora calificada como EMRP.

Promedio tri-anual: es el promedio aritmético de tres años calendario consecutivos de la concentración anual, en cualquier estación monitora.
"""
def normaPM25_promedio_trianual(df:pd.DataFrame)-> pd.DataFrame:
    """
    Entrada: df(dataframe): fecha(datetime), UfId(int), ProcesoId(int), parametro(str), valor(float)
    Salida: result(dataframe): UfId(int), promedio_trianual(float), norma_sobrepasada(Boolean)
    """
    
    limite = 20
    
    df = ( 
          df.copy()
            .loc[df['parametro'] == 'PM25']
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
