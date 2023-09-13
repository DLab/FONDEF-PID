from shapely.geometry import Point;
import geopandas;

chile = geopandas.read_file("chile/chl_admbnda_adm1_bcn_20211008.shp")

def validaLimitesChile(data):
    errores = []
    for item in data['data']:
        longitud = item['longitud']
        latitud = item['latitud']
        p = Point(longitud, latitud)
        if chile.geometry.contains(p).sum() < 1:
            item['tipo'] = 'Coordenadas fuera de chile'
            errores.append(item)
            print(item)
    return errores