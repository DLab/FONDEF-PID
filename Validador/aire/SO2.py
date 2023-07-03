"""
D.S. 114/2021: Establece norma de calidad primaria de aire para Dióxido de Azufre

Límite: 60 µg/m3N (23 ppbv) como concentración anual, 150 µg/m3N (57 ppbv) como
concentración de 24 horas, y 350 µg/m3N (134 ppbv) como concentración de 1 hora.

Se considera sobrepasada la norma en los siguientes casos:
    a) Concentración anual:
        i. El promedio aritmético de tres años calendario sucesivos de los valores de concentración anual, fuere mayor o igual al valor de la norma.
        ii. Si en un año calendario, el valor de la concentración anual, fuere mayor o igual al doble del valor de la norma.

    b) Concentración de 24 horas:
        i. El promedio aritmético de tres años calendario sucesivos de los valores del percentil 99 de las concentraciones de 24 horas registradas cada año, fuere mayor o igual al valor de la norma.
        ii. Si en un año calendario, el valor correspondiente al percentil 99 de las concentraciones de 24 horas registradas, fuere mayor o igual al doble del valor de la norma.
        
    c) Concentración de 1 hora:
        i. El promedio aritmético de tres años calendario sucesivos de los valores del percentil 98,5 de las concentraciones de 1 hora registradas cada año, fuere mayor o igual al valor de la norma. A partir del cuarto año calendario de p para evaluar esta condición.
        ii. Si en un año calendario, el valor correspondiente al percentil 98,5 de las concentraciones de 1 hora registradas, fuere mayor o igual al doble del valor de la norma. A partir del cuarto año calendario de publicada la norma en el Diario Oficial, se considera un percentil 99 para evaluar esta condición.

Condiciones de emergencia ambiental: expresados como concentración de 1 hora de
dióxido de azufre.
_____________________________________________________________________________________________________________________________
|Nivel            |   Niveles de emergencia expresados como concentración de 1 hora de dióxido de azufre en ug/m3N (en ppbv) |
|1 Alerta         |   500 - 649 ug/m3N (191 - 247 ppbv)                                                                      |
|2 Preemergencia  |   650 - 949 ug/m3N (248 - 362 ppbv)                                                                      |
|3 Emergencia     |   950 ug/m3N o superior (363 ppbv o superior)                                                            |
|_________________|__________________________________________________________________________________________________________|

e) Concentración de 1 hora: Promedio aritmético de los valores de las concentraciones de dióxido de azufre, correspondientes a los valores promedios de 5 minutos de las mediciones realizadas durante esa hora.
f) Concentración de 24 horas: Promedio aritmético de los valores de las concentraciones de dióxido de azufre de 1 hora correspondientes a un bloque de 24 horas sucesivas, contadas desde las cero horas de cada día.
g) Concentración mensual: Promedio aritmético de los valores de las concentraciones de dióxido de azufre de 24 horas correspondientes a un mes.
h) Concentración trimestral: Promedio aritmético de los valores de las concentraciones mensuales de dióxido de azufre, correspondientes a tres meses sucesivos.
i) Concentración anual: Promedio aritmético de los valores de las concentraciones trimestrales de dióxido de azufre, correspondientes a un año calendario.
"""

import pandas as pd
import numpy as np
from datetime import datetime

# import promedios_por_hora as proms
# import preprocessing as proms
import functions as fn

# dataframe = proms.dataframe   # importar dataframe

# processing
# ACÁ VA CONVERSIÓN ppb to ug/m3
def preprocessing(df, ufid, procId, param):
    df['fecha'] = pd.to_datetime(df['fecha'])
    df = df[(df['UfId'] == ufid) & (df['ProcesoId'] == procId) & (df['parametro'] == param)]

    
    # rehacer esta conversión
    # df['valor']  = df['valor'] * 2.62   # conversión ppb to ug/m3
    df = df.reset_index(drop = True)

    # print(df)

    return df



def limites(tipoAlerta, nombreLimite):
    # ug/m3
    # limNorma    = {'Lyear': 60, 'L24h' : 150, 'L1h'  : 350}
    # limEpisodio = {'alerta': 500, 'preemergencia': 650, 'emergencia': 950}

    # ppb
    limNorma    = {'Lyear': 23, 'L24h' : 57, 'L1h'  : 134}
    limEpisodio = {'alerta': 191, 'preemergencia': 248, 'emergencia': 363}

    limite = None
    if tipoAlerta == 'norma':
        limite = limNorma[nombreLimite]
    elif tipoAlerta == 'episodio':
        limite = limEpisodio[nombreLimite]
    
    return limite


def emergenciaAmbiental(df, yearCalendar):
    """
    Devuelve episodios de alerta medioambiental. Se utiliza únicamente el resample horario. Retorna un dataframe con los valores en ugm3 o ppb (excluyentemente) 
    """
    df = fn.byYearCalendar(df, yearCalendar)
    df = df.assign(alerta = 0, preEmer = 0, emerg = 0)

    df['alerta']  = np.where((df['valor'] >= limites('episodio', 'alerta')) & (df['valor'] < limites('episodio', 'preemergencia')), 1, df['alerta'])
    df['preEmer'] = np.where((df['valor'] >= limites('episodio', 'preemergencia')) & (df['valor'] < limites('episodio', 'emergencia')), 1, df['preEmer'])
    df['emerg']   = np.where(df['valor'] > limites('episodio', 'emergencia'), 1, df['emerg'])


    return df



def normaTrianual(df, yearCalendar, concType):
    """
    concType: 'Lyear', 'L24h', 'L1h'
    """
    concDF = pd.DataFrame(columns = df.columns)
    perc = 99

    y1, y2, y3 = yearCalendar - 2, yearCalendar - 1, yearCalendar
    limite     = limites('norma', concType)
    value      = None

    dfYear1, dfYear2, dfYear3 = fn.byPeriod(df, yearCalendar)

    if concType == 'Lyear':
        c1, c2, c3 = fn.cAnual(dfYear1, 'SO2'), fn.cAnual(dfYear2, 'SO2'), fn.cAnual(dfYear3, 'SO2')
        value = 'valor'

        concDF = pd.concat([c1, c2, c3])

    elif concType == 'L24h':
        perc1, perc2, perc3 = fn.percentil(fn.c24hours(dfYear1), perc), fn.percentil(fn.c24hours(dfYear2), perc), fn.percentil(fn.c24hours(dfYear3), perc)
        value = 'perc'

        concDF = pd.concat([perc1.tail(1), perc2.tail(1), perc3.tail(1)])

    elif concType == 'L1h':
        perc1, perc2, perc3 = fn.percentil(fn.c1hour(dfYear1), perc), fn.percentil(fn.c1hour(dfYear2), perc), fn.percentil(fn.c1hour(dfYear3), perc)
        value = 'perc'

        concDF = pd.concat([perc1.tail(1), perc2.tail(1), perc3.tail(1)])
        

    meanValue     = concDF[value].mean()
    concDF        = concDF.iloc[[0]]
    concDF[value] = meanValue

    concDF = concDF.assign(year = yearCalendar)
    concDF = concDF.drop(['fecha'], axis = 1)

    # CREAR DF CON TODOS LaS horas DEL AÑO Y RELLENAR


    concDF['superaLimite'] = np.where(concDF['valor'] >= limite, 1, 0)

    # print("concDF")
    # print(concDF)

    return concDF



def normaAnual(df, yearCalendar, concType):
    """
    concType: 'Lyear', 'L24h', 'L1h'
    """
    perc = 99
    limite = limites('norma', concType)
    concDF = pd.DataFrame(columns = df.columns)

    if concType == 'Lyear':
        concDF = fn.cAnual(df, 'SO2')
        concDF['year'] = pd.DatetimeIndex(concDF['fecha']).year
        concDF = concDF.drop(['fecha'], axis = 1)
    elif concType == 'L24h':
        concDF = fn.percentil(fn.c24hours(df), perc)
    elif concType == 'L1h':
        concDF = fn.percentil(fn.c1hour(df), perc)

    concDF['superaLimite'] = np.where(concDF['valor'] >= (2 * limite), 1, 0)

    return concDF


def cuentaAhorro(df, yearCalendar, concType, perc):
    """
    df: tiene que ser el dataframe devuelto por la norma anual
    concType: 'L24h', 'L1h'
    """
    nHrsAnuales = 24 * 365  # cantidad total de horas en el año
    nDaysByYear = 365       # cantidad de días al año
    df          = normaAnual(df, yearCalendar, concType)

    if concType == 'L1h':
        totalAnual = nHrsAnuales
    elif concType == 'L24h':
        totalAnual = nDaysByYear

    percTotalAnual = (totalAnual * perc) / 100
    ctaAhorro      = totalAnual - percTotalAnual

    df = df.assign(counter = 0, notifNorma = 0)

    df['counter']    = df['superaLimite'].cumsum()
    df['notifNorma'] = np.where(df['counter'] >= ctaAhorro, 1, df['counter'])

    return df



def main(df, yearCalendar, tipoNorma, concType=None, perc=99):
    """
    tipoNorma: 'normaTrianual', 'normaAnual', 'emergenciaAmbiental', 'cuentaAhorro'
    concType: 'Lyear', 'L24h', 'L1h'
    """
    lstDFs, lstUfId, lstProcId = [], df['UfId'].unique(), df['ProcesoId'].unique()
    SO2 = pd.DataFrame(columns = df.columns)

    for ufid in lstUfId:
        for procId in lstProcId:
            tmpdf = preprocessing(df, ufid, procId, 'SO2')
            if tipoNorma == 'normaTrianual':
                tmpdf = normaTrianual(tmpdf, yearCalendar, concType)
                # print("tmpdf")
                # print(tmpdf)
            elif tipoNorma == 'normaAnual':
                tmpdf = normaAnual(df, yearCalendar, concType)
            elif tipoNorma == 'emergenciaAmbiental':
                tmpdf = emergenciaAmbiental(tmpdf, yearCalendar)
            elif tipoNorma == 'cuentaAhorro':
                tmpdf = cuentaAhorro(tmpdf, yearCalendar, concType, perc)
            lstDFs.append(tmpdf)
    
    SO2 = pd.concat(lstDFs)

    return SO2


# norma_trianual  = main(dataframe, 2022, 'normaTrianual', concType='Lyear')
# norma_anual     = main(dataframe, 2022, 'normaAnual', concType='Lyear')
# emerg_ambiental = main(dataframe, 2022, 'normaAnual', concType='Lyear')
# cuenta_ahorro   = main(dataframe, 2022, 'cuentaAhorro', concType='L1h')

# print(norma_anual)






