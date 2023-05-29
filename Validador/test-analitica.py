from connect_db import getConnect
from pandas import DataFrame

def analitica(inicio, termino, fuente):
    with getConnect() as conn:
        cur = conn.cursor()
        cur.execute("SELECT dpr_ufid, dpr_idproceso, dpr_fecha, dpr_prm_codigo, dpr_valor from datos_promedios where dpr_fecha >= %s and dpr_fecha <= %s and dpr_tipo = %s", [inicio, termino, fuente])
        df = DataFrame(cur.fetchall())
        df.columns = ['ufId', 'idProceso', 'fecha', 'parametro', 'valor']
        cur.close()        
        return df        

def generaAnalitica(inicio, termino, parametro, ufId, procesoId, tipoAnalitica, dataFrame):
    print(dataFrame)
    return 'OK'

data = analitica('2021-03-10 00:00:00', '2021-03-13 00:00:00', 'crudos')
generaAnalitica('2021-03-10 00:00:00', '2021-03-13 00:00:00', 'CO', 222, 12, 'ANALISIS_DE_TENDENCIA_AIRE', data)