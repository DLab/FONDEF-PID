import pandas as pd
from connect_db import getConnect
from pandas import DataFrame
from datetime import datetime, timedelta
from aire.val_normativas.PM10 import normaPM10_promedio_diario, normaPM10_promedio_trianual
from aire.val_normativas.PM25 import normaPM25_promedio_diario, normaPM25_promedio_trianual
from aire.val_normativas.SO2 import normaSO2_anual_agno, normaSO2_anual_diario, normaSO2_anual_horario, normaSO2_trianual_agno, normaSO2_anual_horario, normaSO2_trianual_diario, normaSO2_trianual_horario, normaSO2_cuenta_ahorro_diario, normaSO2_cuenta_ahorro_horario, normaSO2_emergencia_ambiental
from aire.val_normativas.NO2 import normaNO2_trianual_horario, normaNO2_trianual_agno, normaNO2_emergencia_ambiental


def getDataFrame(con, fechaInicial, fechaFinal, parametro):
    cur = con.cursor()
    cur.execute("SELECT dpr_ufid, dpr_idproceso, dpr_fecha, dpr_prm_codigo, dpr_valor from datos_promedios where dpr_fecha >= %s and dpr_fecha < %s and dpr_prm_codigo = %s and dpr_tipo = %s", [fechaInicial, fechaFinal, parametro, 'validados'])
    df = DataFrame(cur.fetchall())
    cur.close()        
    if (len(df) > 0):
        df.columns = ['UfId', 'ProcesoId', 'fecha', 'parametro', 'valor']
        df['fecha'] = pd.to_datetime(df['fecha'])
    return df
  
def valida_normativas_aire(agno):
    if (agno != None):
        fechaInicial = agno + '-01-01 00:00:00'
        fechaFinal = str(int(agno) + 1) + '-01-01 00:00:00'
    else:
        now = datetime.now()
        fechaInicial = now.strftime('%Y') + '-01-01 00:00:00'
        fechaFinal = now.strftime('%Y-%m-%d %H:%M:%S') 
    with getConnect() as conn:
        print('antes', fechaInicial, fechaFinal)
        df = getDataFrame(conn, fechaInicial, fechaFinal, 'PM10')
        if (len(df) > 0):
            df2 = df.copy()
            df = normaPM10_promedio_diario(df)
            df = df[df['dias_cuentaAhorro'] <= 0]
            print('normaPM10_promedio_diario con error\n', df)
            
            df = df2.copy()
            #df = normaPM25_promedio_diario(df)
            #PENDIENTE revisar con giani Empty DataFrame
            print('normaPM25_promedio_diario\n', df)
                        
            df = df2.copy()
            df = normaNO2_emergencia_ambiental(df, agno)
            print('normaNO2_emergencia_ambiental\n', df)
            
            df = df2.copy()
            df = normaSO2_emergencia_ambiental(df, agno)
            print('normaSO2_emergencia_ambiental\n', df)
            
            df = df2.copy()
            df = normaSO2_anual_agno(df, agno)
            print('normaSO2_anual_agno\n', df)

            df = df2.copy()
            df = normaSO2_anual_horario(df, agno)
            print('normaSO2_anual_horario\n', df)

            df = df2.copy()
            df = normaSO2_anual_diario(df, agno)
            print('normaSO2_anual_diario\n', df)
    
            df = df2.copy()
            df = normaSO2_cuenta_ahorro_diario(df, agno)
            print('normaSO2_cuenta_ahorro_diario\n', df)

            df = df2.copy()
            df = normaSO2_cuenta_ahorro_horario(df, agno)
            print('normaSO2_cuenta_ahorro_horario\n', df)
    return 'OK'

def valida_normativas_aire_trianual(agno):
    if (agno == None):
        now = datetime.now()
        agno = int(now.strftime('%Y')) - 3
    fechaInicial = agno + '-01-01 00:00:00'
    fechaFinal = str(int(agno) + 3) + '-01-01 00:00:00'
    with getConnect() as conn:
        print('antes', fechaInicial, fechaFinal)
        df = getDataFrame(conn, fechaInicial, fechaFinal, 'PM10')
        if (len(df) > 0):
            df2 = df.copy()
            df = normaPM25_promedio_trianual(df)
            print('normaPM25_promedio_trianual\n', df)
            
            df = df2.copy()
            df = normaPM10_promedio_trianual(df)
            print('normaPM10_promedio_trianual\n', df)
            
            df = df2.copy()
            df = normaNO2_trianual_agno(df, agno)
            print('normaNO2_trianual_agno\n', df)

            df = df2.copy()
            df = normaNO2_trianual_horario(df, agno)
            print('normaNO2_trianual_horario\n', df)

            df = df2.copy()
            df = normaSO2_trianual_agno(df, agno)
            print('normaSO2_trianual_agno\n', df)

            df = df2.copy()
            df = normaSO2_trianual_diario(df, agno)
            print('normaSO2_trianual_diario\n', df)

            df = df2.copy()
            df = normaSO2_trianual_horario(df, agno)
            print('normaSO2_trianual_horario\n', df)
    return 'OK'