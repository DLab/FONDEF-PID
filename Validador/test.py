from datetime import datetime, timedelta

def addMonth(fecha):
    t = fecha.strftime('%Y-%m-%d').split('-')
    mes = int(t[1])
    agno = int(t[0])
    if (mes == 12):
        return datetime.strptime(str(agno + 1) + '-01-01 00:00:00', '%Y-%m-%d %H:%M:%S')
    else:
        return datetime.strptime(t[0] + '-' + str(mes + 1) + '-01 00:00:00', '%Y-%m-%d %H:%M:%S')
    
    
fecha = datetime.strptime('2021-01-01 00:00:00', '%Y-%m-%d %H:%M:%S')
print(fecha)
for i in range(0, 36):
    fecha = addMonth(fecha)
    print(fecha)
    