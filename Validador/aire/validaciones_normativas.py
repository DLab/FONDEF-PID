import pandas as pd
from connect_db import getConnect
from pandas import DataFrame
from datetime import datetime, timedelta
from aire.val_normativas.PM10 import normaPM10_promedio_diario, normaPM10_promedio_trianual


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
            df2 = normaPM10_promedio_trianual(df2)
            print('normaPM10_promedio_trianual\n', df2)
            
    return 'OK'