from connect_db import getConnect
from pandas import DataFrame

def getData(inicio, termino, fuente):
    with getConnect() as conn:
        cur = conn.cursor()
        cur.execute("SELECT dpr_ufid, dpr_idproceso, dpr_fecha, dpr_prm_codigo, dpr_valor from datos_promedios where dpr_fecha >= %s and dpr_fecha <= %s and dpr_tipo = %s", [inicio, termino, fuente])
        df = DataFrame(cur.fetchall())
        df.columns = ['ufId', 'idProceso', 'fecha', 'parametro', 'valor']
        cur.close()        
        return df        

"""Este método es el que hay que implementar"""
def generaAnaliticaIA(inicio, termino, parametro, ufId, procesoId, dataFrame):
    print(dataFrame)
    return 'OK'


inicio = '2021-03-10 00:00:00'
termino = '2021-03-13 00:00:00'
tipoDato = 'crudos'
parametro = 'CO'
ufId = 222
procesoId = 12

data = getData(inicio, termino, tipoDato)
generaAnaliticaIA(inicio, termino, parametro, ufId, procesoId, data)