"""
D.S. 114/2021: Establece norma de calidad primaria de aire para Dióxido de Nitrógeno

Límite: 53 ppbv (100 ug/m3N) como concentración anual y 213 ppbv (400 ug/m3N) como
concentración de una hora.

Se considera sobrepasada la norma en los siguientes casos:

a) Concentración anual: cuando el promedio aritmético de los valores de
                        concentración anual de tres años calendarios sucesivos, en cualquier estación
                        monitora EMRPG, fuere mayor o igual a 53 ppbv.
b) Concentración de 1 hora: cuando el promedio aritmético de tres años sucesivos
                            del percentil 99 de los máximos diarios de concentración de 1 hora registrados
                            durante un año calendario, en cualquier estación monitora EMRPG, fuere mayor o
                            igual a 213 ppbv.

Condiciones de emergencia ambiental: aquéllos en que la concentración de 1 hora se
encuentre dentro de los siguientes rangos

Nivel 1: 601 - 1201 ppbv (1130 - 2259 ug/m3N)
Nivel 2: 1202 - 1595 ppbv (2260 - 2999 ug/m3N)
Nivel 3: 1596 ppbv o superior (3000 ug/m3N o superior)

Esta norma no incluye un índice de calidad del aire.


c.  Concentración de 1 hora: Promedio aritmético de los valores de concentración de dióxido de nitrógeno medidos en 1 hora.
d.  Concentración de 24 horas: Promedio aritmético de los valores de concentración de 1 hora de dióxido de nitrógeno correspondientes a un bloque de 24 horas sucesivas, contadas desde las cero horas de cada día.
e.  Concentración trimestral: Promedio aritmético de los valores de concentración de 24 horas de dióxido de nitrógeno correspondientes a un periodo de tres meses consecutivos.
f.  Concentración anual: Promedio aritmético de los valores de concentración trimestral de dióxido de nitrógeno correspondientes a un año calendario.
"""

import pandas as pd
import numpy as np
from datetime import datetime

# import preprocessing as proms
import aire.val_normativas.functions_no2_so2 as fn

# dataframe = proms.dataframe   # importar dataframe


# ACÁ VA CONVERSIÓN ppb to ug/m3
def preprocessing(df, ufid, procId, param):
    df['fecha'] = pd.to_datetime(df['fecha'])
    df = df[(df['UfId'] == ufid) & (df['ProcesoId'] == procId) & (df['parametro'] == param)]
    
    # df['valor']  = df['valor'] * 2.62   # conversión ppb to ug/m3
    df = df.reset_index(drop = True)
    # print("df")
    # print(df)

    return df



def limites(tipoAlerta, nombreLimite):
    # ug/m3
    # limNorma    = {'Lyear': 100, 'L1h'  : 400}
    # limEpisodio = {'nivel1': 1130, 'nivel2': 2260, 'nivel3': 3000}
    # ppb
    limNorma    = {'Lyear': 53, 'L1h': 213}
    limEpisodio = {'nivel1': 601, 'nivel2': 1202, 'nivel3': 1596}

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
    df = df.assign(nivel1 = 0, nivel2 = 0, nivel3 = 0)

    df['nivel1']  = np.where((df['valor'] >= limites('episodio', 'nivel1')) & (df['valor'] < limites('episodio', 'nivel2')), 1, df['nivel1'])
    df['nivel2'] = np.where((df['valor'] >= limites('episodio', 'nivel2')) & (df['valor'] < limites('episodio', 'nivel3')), 1, df['nivel2'])
    df['nivel3']   = np.where(df['valor'] > limites('episodio', 'nivel3'), 1, df['nivel3'])

    return df


def normaTrianual(df, yearCalendar, concType):
    """
    concType: 'Lyear', 'L1h'
    """
    concDF = pd.DataFrame(columns = df.columns)
    perc = 99

    y1, y2, y3 = yearCalendar - 2, yearCalendar - 1, yearCalendar
    limite     = limites('norma', concType)
    value      = None

    dfYear1, dfYear2, dfYear3 = fn.byPeriod(df, yearCalendar)
    concCero = df.iloc[[0]]
    concCero['valor'] = 0

    if concType == 'Lyear':
        c1, c2, c3 = fn.cAnual(dfYear1, 'N02'), fn.cAnual(dfYear2, 'N02'), fn.cAnual(dfYear3, 'N02')
        value = 'valor'

        # esto es sólo para el NO2
        if c1.shape[0] == 0: c1 = concCero
        if c2.shape[0] == 0: c2 = concCero
        if c3.shape[0] == 0: c3 = concCero

        concDF = pd.concat([c1, c2, c3])

    elif concType == 'L1h':
        # primero los máximos diarios
        dailyMax1, dailyMax2, dailyMax3 = pd.DataFrame(columns = df.columns), pd.DataFrame(columns = df.columns), pd.DataFrame(columns = df.columns)
        value  = 'perc'
        lstDFs = []

        max1, max2, max3 = fn.c1hour(dfYear1), fn.c1hour(dfYear2), fn.c1hour(dfYear3)

        max1['dia'] = pd.to_datetime(max1['fecha']).dt.date
        max2['dia'] = pd.to_datetime(max2['fecha']).dt.date
        max3['dia'] = pd.to_datetime(max3['fecha']).dt.date

        for df in [max1, max2, max3]:
            for d in df['dia'].unique():
                tmpdf          = df[df['dia'] == d]
                maxValue       = tmpdf['valor'].max()
                tmpdf          = tmpdf.iloc[[0]]
                tmpdf['valor'] = maxValue
                lstDFs.append(tmpdf)

        max_diarios = pd.concat(lstDFs)
        max_diarios['year'] = pd.DatetimeIndex(max_diarios['fecha']).year

        dailyMax1, dailyMax2, dailyMax3 = fn.byPeriod(max_diarios, yearCalendar)

        dailyMax1 = dailyMax1.drop(['dia'], axis = 1)
        dailyMax1 = dailyMax1.reset_index(drop = True)
        dailyMax2 = dailyMax2.drop(['dia'], axis = 1)
        dailyMax2 = dailyMax2.reset_index(drop = True)
        dailyMax3 = dailyMax3.drop(['dia'], axis = 1)
        dailyMax3 = dailyMax3.reset_index(drop = True)

        perc1, perc2, perc3 = fn.percentil(dailyMax1, perc), fn.percentil(dailyMax2, perc), fn.percentil(dailyMax3, perc)
        concDF = pd.concat([perc1.tail(1), perc2.tail(1), perc3.tail(1)])
    

    meanValue     = concDF[value].mean()
    concDF        = concDF.iloc[[0]]
    concDF[value] = meanValue

    concDF = concDF.assign(year = yearCalendar)
    concDF = concDF.drop(['fecha'], axis = 1)

    concDF['superaLimite'] = np.where(concDF['valor'] >= limite, 1, 0)

    return concDF


def normaNO2(df, yearCalendar, tipoNorma, concType=None):
    """
    tipoNorma: 'normaTrianual', 'emergenciaAmbiental'
    concType: 'Lyear', 'L1h'
    """
    lstDFs, lstUfId, lstProcId = [], df['UfId'].unique(), df['ProcesoId'].unique()
    NO2 = pd.DataFrame(columns = df.columns)

    for ufid in lstUfId:
        for procId in lstProcId:
            tmpdf = preprocessing(df, ufid, procId, 'NO2')
            # print("c1", fn.cAnual(tmpdf, 'N02'))
            # print("c2", fn.cAnual(tmpdf, 'N02'))
            # print("c3", fn.cAnual(tmpdf, 'N02'))
            if tipoNorma == 'normaTrianual':
                tmpdf = normaTrianual(tmpdf, yearCalendar, concType)
                # print("tmpdf")
                # print(tmpdf)
            if tipoNorma == 'emergenciaAmbiental':
                tmpdf = emergenciaAmbiental(tmpdf, yearCalendar)
            lstDFs.append(tmpdf)

    NO2 = pd.concat(lstDFs)

    return NO2

def normaNO2_trianual_horario(df, yearCalendar):
    return normaNO2(df, yearCalendar, 'normaTrianual', 'L1h')

def normaNO2_trianual_agno(df, yearCalendar):
    return normaNO2(df, yearCalendar, 'normaTrianual', 'Lyear')

def normaNO2_emergencia_ambiental(df, yearCalendar):
    return normaNO2(df, yearCalendar, 'emergenciaAmbiental')

# emerg_ambiental = main(dataframe, 2021, 'emergenciaAmbiental')
# norma_trianual  = main(dataframe, 2022, 'normaTrianual', concType='L1h')

# print(norma_trianual)

