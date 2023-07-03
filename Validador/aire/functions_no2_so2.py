
import pandas as pd
import numpy as np
from datetime import datetime
from dateutil.relativedelta import relativedelta

######################################
import preprocessing as proms
dataframe = proms.dataframe   # importar dataframe
######################################


def concatDF(df, nameCol):
    dfTmp  = pd.DataFrame(columns = df.columns)
    lstDFs = []

    listTmpDF = df[nameCol].unique()

    if df.shape[0] > 0:
        for attr in listTmpDF:
            tmpdf = df[df[nameCol] == attr]
            tmpdf = tmpdf.reset_index(drop = True)
            # print("cant dias - month", month, ":", tmpdf.shape[0])
            meanValue      = tmpdf['valor'].mean()
            tmpdf          = tmpdf.iloc[[0]]
            tmpdf['valor'] = meanValue

            lstDFs.append(tmpdf)

        dfTmp = pd.concat(lstDFs)
    else:
        dfTmp = df

    dfTmp = dfTmp[['fecha', 'UfId', 'ProcesoId', 'parametro', 'valor', 'dataPoint_count']]
    dfTmp = dfTmp.reset_index(drop = True)

    return dfTmp


def byYearCalendar(df, yearCalendar):
    df['year'] = pd.DatetimeIndex(df['fecha']).year
    df         = df[df['year'] == yearCalendar]
    df         = df.drop(['year'], axis = 1)
    df         = df.reset_index(drop = True)

    return df


def byPeriod(df, yearCalendar):
    # Tomamos el inicio del primer año calendario y vamos 3 años atrás
    beginningYear = datetime(yearCalendar - 3, 1, 1).strftime('%Y-%m-%d')
    df['fecha']   = pd.to_datetime(df['fecha'])
    df['day']     = df['fecha'].dt.date 

    # existe este registro en el dataframe?
    listDates = [day.strftime('%Y-%m-%d') for day in df['day'].tolist()]

    if beginningYear in listDates:
        print(beginningYear, "in listDates")
        df = byYearCalendar(df, yearCalendar - 2), byYearCalendar(df, yearCalendar - 1), byYearCalendar(df, yearCalendar)
    else:
        df['year'] = pd.DatetimeIndex(df['fecha']).year
        # seleccionamos primera fecha existente
        firstDate  = df.iloc[0].fecha
        firstYear  = firstDate.year
        secondYear, thirdYear, fourthYear = firstYear + 1, firstYear + 2, firstYear + 3

        dfYear1, dfYear2, dfYear3 = pd.DataFrame(columns = df.columns), pd.DataFrame(columns = df.columns), pd.DataFrame(columns = df.columns)
        periods = []

        for i in range(0,3):
            auxDate1 = (firstDate + relativedelta(years = i)).date()
            auxDate2 = (firstDate + relativedelta(years = i + 1)).date()

            auxDate1, auxDate2 = pd.to_datetime(auxDate1), pd.to_datetime(auxDate2)

            auxYear1 = firstYear + i
            auxYear2 = firstYear + i + 1
           
            auxdf1  = df[(df['year'] == auxYear1) & (df['fecha'] >= auxDate1)]
            auxdf2  = df[(df['year'] == auxYear2) & (df['fecha'] < auxDate2)]

            auxdf1 = auxdf1.drop(['day', 'year'], axis = 1)
            auxdf2 = auxdf2.drop(['day', 'year'], axis = 1)
            
            globals()[f"dfYear{i + 1}"] = pd.concat([auxdf1, auxdf2])
            periods.append(globals()[f"dfYear{i + 1}"])

        df = periods[0].reset_index(drop = True), periods[1].reset_index(drop = True), periods[2].reset_index(drop = True)
        # print(df)
    
    return df
       


def c1hour(df):
    """
    devuelve df resampleado por hora y con el año calendario requerido
    """

    return df


def c24hours(df):
    df        = c1hour(df)
    df['dia'] = pd.to_datetime(df['fecha']).dt.date
    # dfDay     = df
    # if df.shape[0] > 0:
    dfDay = concatDF(df, 'dia')

    return dfDay


def c1month(df):
    df        = c24hours(df)
    df['mes'] = pd.to_datetime(df['fecha']).dt.month
    # dfMonth   = df
    # if df.shape[0] > 0:
    dfMonth   = concatDF(df, 'mes')

    return dfMonth


# VALIDAR BIEN PARA TRIMESTRES FALTANTES
def cTrimestral(df, param):
    if param == 'SO2':
        df = c1month(df)
    elif param == 'NO2':
        df = c1hour(df)
    
    df['mes']  = pd.to_datetime(df['fecha']).dt.month
    df['trim'] = np.nan

    for i, j in enumerate([3, 6, 9, 12]):
        df['trim'] = np.where((df['mes'] > j - 3) & (df['mes'] <= j), i + 1, df['trim'])

    # dfTrim   = df
    # if df.shape[0] > 0:
    dfTrim = concatDF(df, 'trim')

    return dfTrim


def cAnual(df, param):
    df = cTrimestral(df, param)

    if df.shape[0] > 0:
        meanValue   = df['valor'].mean()
        df          = df.iloc[[0]]
        df['valor'] = meanValue

    return df


def percentil(df, nPerc):
    df = df.assign(perc = 0)

    for index in range(0, df.shape[0]):
        tmpdf = df.loc[0:index]
        tmpPerc = tmpdf['valor'].tolist()
        valPerc = round(np.percentile(tmpPerc, nPerc), 3)
        df.loc[index, 'perc'] = valPerc

    return df


byPeriod(dataframe, 2023)


