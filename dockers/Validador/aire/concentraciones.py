import pandas as pd

"""
DECRETO 61  APRUEBA REGLAMENTO DE ESTACIONES DE MEDICIÓN DE CONTAMINANTES ATMOSFÉRICOS
    https://www.bcn.cl/leychile/navegar?i=281728&f=2009-09-21
Artculo 2 , letra n):
Promedio diario: Aquel que se calcula con la información medida entre la hora 0 y la hora 23. 
El promedio diario deberá calcularse con al menos 18 valores de promedio. En la medición de 
material particulado con equipos basados en el método gravimétrico de alto y bajo volumen, el
promedio diario se calculará sobre la base de 18 horas continuas de medición. Ello sin 
perjuicio de lo dispuesto en las normas primarias de calidad del aire respectivas.
"""
#ESTA DEFINICION ME RESULTA ALTAMENTE AMBIGUA. POR AHORA IMPLEMENTO UN PROMEDIO DIARIO DE FORMA TRIVIAL
def promedios_dia(df):
    """
    Entrada: df(dataframe): fecha(datetime), UfId(int), ProcesoId(int), parametro(str), valor(float)
    Salida: result(dataframe): dia(Period), UfId(int), ProcesoId(int), parametro(str), valor(float)
    """
    result = df.copy()
    result['dia'] = result['fecha'].dt.to_period('D')

    result = (result
        .groupby(['dia', 'UfId', 'ProcesoId', 'parametro'], as_index=False)
        ['valor']
        .mean())

    return result


"""
(Material Particulado 2.5 | D.S. 12/2011 | https://www.bcn.cl/leychile/navegar?idNorma=1025202)
Concentración mensual: Corresponde al promedio de los valores efectivamente medidos de concentración de 
24 horas en la estación monitora, en un mes calendario.
"""
def concentracion_mensual(df):
    """
    Entrada: df(dataframe): dia(Period), UfId(int), ProcesoId(int), parametro(str), valor(float)
    Salida: result(df): mes(datetime), UfId(int), ProcesoId(int), parametro(str), valor(float)
    """
    
    result = df.copy()
    result['mes'] = df['dia'].dt.to_timestamp('s').dt.to_period('M')

    if (len(result) == 0):
        return result
    
    result = (result.groupby(['mes', 'UfId', 'ProcesoId', 'parametro'], as_index=False)
              ['valor']
              .mean())
    
    return result


"""
(Material Particulado 2.5 | D.S. 12/2011 | https://www.bcn.cl/leychile/navegar?idNorma=1025202)
Concentración anual: Corresponde al promedio de los valores de concentración mensual en la estación monitora, en un año calendario.
"""
def concentracion_anual(df):
    """
    Entrada: df(dataframe), mes(Period), UfId(int), ProcesoId(int), parametro(str), valor(float)
    Salida: result(df): año(Period), UfId(int), ProcesoId(int), parametro(str), valor(float)
    """
    result = df.copy()
    result['año'] = df['mes'].dt.to_timestamp('s').dt.to_period('Y')
    
    if (len(result) == 0):
        return result

    result = (result.groupby(['año', 'UfId', 'ProcesoId', 'parametro'], as_index=False)
              ['valor']
              .mean())
    
    return result







              
        
    
    


