from connect_db import getConnect
from pandas import DataFrame

def getRangoDatosxUfId():
    with getConnect() as conn:
        cur = conn.cursor()
        cur.execute("select dpr_ufId, dpr_idproceso, min(dpr_fecha) fechaInicio, max(dpr_fecha) fechaTermino from datos_promedios group by dpr_ufId, dpr_idproceso")
        df = DataFrame(cur.fetchall())
        cur.close()        
        if (len(df) > 0):
            df.columns = ['ufId', 'idProceso', 'fechaInicio', 'fechaTermino']
            df.to_csv('RangoDeDatos.csv')
        return 'Generacion RangoDeDatos.csv'

print(getRangoDatosxUfId())