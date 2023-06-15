package cl.dlab.pid.calidaddelaire;

import java.io.File;
import java.io.FileWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import cl.dlab.pid.util.Param;
import cl.dlab.pid.util.PropertyUtil;
import cl.dlab.pid.util.Util;

public class GeneraPromedios {
	
	private static Logger logger = LoggerFactory.getLogger(GeneraArchivos.class);
	private static SimpleDateFormat FMT = new SimpleDateFormat("yyyy-MM-dd");
	private static SimpleDateFormat FMT2 = new SimpleDateFormat("yyyy-MM-01 00:00:00");
	private static SimpleDateFormat FMT3 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private static SimpleDateFormat FMT4 = new SimpleDateFormat("yyyyMMddHHmmss");
	private static SimpleDateFormat FMT_MES = new SimpleDateFormat("MM");
	
	private class Item
	{
		String id;
		String idLimite;
		String idPromedio;
		Integer ufId;
		Integer procesoId;
		Integer dispositivoId;
		String parametro;
		Double valor;
		String unidad;
		String fecha;
		String tipoDato;
		public Item(Integer ufId, Integer procesoId, Integer dispositivoId, String parametro, Double valor, String unidad, Date fecha, String tipoDato)
		{
			this.ufId = ufId;
			this.procesoId = procesoId;
			this.dispositivoId = dispositivoId;
			this.parametro = parametro;
			this.valor = valor;
			this.unidad = unidad;
			this.fecha = FMT3.format(fecha);
			this.tipoDato = tipoDato;
			this.id = ufId + "_" + procesoId + "_" + parametro + "_" + FMT4.format(fecha);
			this.idLimite = ufId + "_" + procesoId + "_" + dispositivoId + "_" + parametro;
			this.idPromedio = ufId + "_" + procesoId;
		}
	}
	private class Limites
	{
		HashMap<String, HashMap<String, Object>> limites;
		HashMap<String, Object> notificaciones;
		public Limites(HashMap<String, HashMap<String, Object>> limites)
		{
			this.limites = limites;
			this.notificaciones = new HashMap<String, Object>();
		}
		private HashMap<String, Object> getError(String error, HashMap<String, Object> limite, Item obj)
		{
			HashMap<String, Object> hs = new HashMap<String, Object>();
			hs.put("error", error);
			hs.put("limite", limite);
			hs.put("obj", obj);
			return hs;
		}
		public boolean validaLimite(Item obj, boolean notifica)
		{
			HashMap<String, Object> values = this.limites.get(obj.idLimite);
			if (values == null) {
				return true;
			}
			if (!values.get("unidad").equals(obj.unidad))
			{
                if (notifica)
                    this.notificaciones.put(obj.id, getError("Unidad de medida no corresponde", values, obj));
                return false;
			}
            else if (obj.valor < (Double)values.get("minimo"))
            {
                if (notifica)
                	this.notificaciones.put(obj.id, getError("Valor es menor que el mínimo permitido", values, obj));
                return false;
            }
            else if (obj.valor > (Double)values.get("maximo"))
            {
                if (notifica)
                	this.notificaciones.put(obj.id, getError("Valor es mayor que el máximo permitido", values, obj));
                return false;
            }
            else
                this.notificaciones.put(obj.id, null);
			return true;
		}
		public void notificar()
		{
			for (String key : notificaciones.keySet()) {
				Object value = notificaciones.get(key);
				if (value != null)
				{
					System.out.println("Limite:" + value);
				}
					
			}
		}
	}
	private class ItemPromedio
	{
		HashMap<String, ArrayList<Object>> hsUfIds;
		HashMap<String, ArrayList<Object>> hsProcesoId;
		HashMap<String, ArrayList<Object>> hsDispositivoId;
		HashMap<String, ArrayList<Object>> hsParametro;
		HashMap<String, ArrayList<Object>> hsValor;
		HashMap<String, ArrayList<Object>> hsUnidad;
		HashMap<String, ArrayList<Object>> hsFecha;
		HashMap<String, ArrayList<Object>> hsTiposDatos;
		
		public ItemPromedio()
		{
			hsUfIds = initArray();
			hsProcesoId = initArray();
			hsDispositivoId = initArray();
			hsParametro = initArray();
			hsValor = initArray();
			hsUnidad = initArray();
			hsFecha = initArray();
			hsTiposDatos = initArray();			
		}
		
	}
	
	protected Bson getFilter(Date fechaInicio, Date fechaTermino)
	{
		Bson filter =  Filters.and(Filters.gte("timestamp", new Timestamp(fechaInicio.getTime())), Filters.lt("timestamp", new Timestamp(fechaTermino.getTime())));
		System.out.println("Filter:" + filter);
		return filter;
	}
	
	private Date getFechaMaxima(Connection con) throws Exception
	{
		
		try(PreparedStatement stmt = con.prepareStatement("SELECT max(dpr_fecha) as fecha from datos_promedios"))
		{
			try(ResultSet rset = stmt.executeQuery())
			{
				if (rset.next())
				{
					return FMT3.parse(rset.getString(1));
				}
			}
		}
		return FMT.parse(PropertyUtil.getProperty("dlab.pid.mongodb.fechaminima"));
	}
	private HashMap<String, HashMap<String, Object>> getLimites(Connection con) throws SQLException
	{
		HashMap<String, HashMap<String, Object>> result = new HashMap<String, HashMap<String,Object>>();
		try(PreparedStatement stmt = con.prepareStatement("select lmt_rgd_id, lmt_est_id, lmt_dispositivo, lmt_parametro, lmt_unidad_medida, lmt_minimo, lmt_maximo from limites_aire"))
		{
			try(ResultSet rset = stmt.executeQuery())
			{
				if (rset.next())
				{
					HashMap<String, Object> hs = new HashMap<String, Object>();
					hs.put("unidad", rset.getString(5));
					hs.put("minimo", rset.getDouble(6));
					hs.put("maximo", rset.getDouble(7));
					String id = rset.getInt(1) + '_' + rset.getInt(2) + '_' + rset.getInt(3) + '_' + rset.getString(4);
					result.put(id, hs);
				}
			}
		}
		return result;
	}
	
	public void calculaUltimosPromedios() throws Exception
	{
		
		Class.forName("org.postgresql.Driver");
		String url = PropertyUtil.getProperty("dlab.pid.postgresql.uri");
		try(Connection con = DriverManager.getConnection(url))
		{
			HashMap<String, HashMap<String, Object>> limites = getLimites(con);
			DataBase db = DataBase.ApiRest;
			MongoClientURI connectionString = new MongoClientURI(PropertyUtil.getProperty("dlab.pid.mongodb.uri"));
			MongoClient mongoClient = new MongoClient(connectionString);
			try
			{
				MongoDatabase database = mongoClient.getDatabase(db.getDbName());
				MongoCollection<Document> collection = database.getCollection(db.getCollectionName());
				Calendar cal = Calendar.getInstance();
				long now = cal.getTime().getTime();
				Date fecha = getFechaMaxima(con);
				System.out.println("fecha:" + fecha);
				cal.setTime(fecha);
				cal.add(Calendar.HOUR_OF_DAY, 1);
				fecha = FMT2.parse(FMT2.format(cal.getTime()));
						
				System.out.println(fecha);
				while(fecha.getTime() < now) 
				{
					cal.setTime(fecha);
					Date fechaInicial = fecha;
					cal.add(Calendar.MONTH, 1);
					fecha = cal.getTime();
					cal.add(Calendar.DAY_OF_YEAR, 15);
					calculaPromedios(collection, fechaInicial, cal.getTime(), false, limites);
				}
			}
			finally
			{
				mongoClient.close();
			}
			logger.info("***************************************************************************");
			logger.info("Termina de generar promedios");
			logger.info("***************************************************************************");
		}
	}
	
	private HashMap<String, ArrayList<Object>> initArray()
	{
		HashMap<String, ArrayList<Object>> hs = new HashMap<String, ArrayList<Object>>();
		hs.put("crudos", new ArrayList<Object>());
		hs.put("validados", new ArrayList<Object>());
		hs.put("mixtos", new ArrayList<Object>());
		return hs;
	}
	
	
	private String getPropertyValue(Document param, String property)
	{
		if (param.containsKey(property))
		{
			return param.getString(property);
		}
		return "nan";
	}
	private void addValue(String property, ItemPromedio promedio, Item obj)
	{
	    promedio.hsUfIds.get(property).add(obj.ufId);
	    promedio.hsProcesoId.get(property).add(obj.procesoId);
	    promedio.hsDispositivoId.get(property).add(obj.dispositivoId);
	    promedio.hsParametro.get(property).add(obj.parametro);
	    promedio.hsValor.get(property).add(obj.valor);
	    promedio.hsUnidad.get(property).add(obj.unidad);
	    promedio.hsFecha.get(property).add(obj.fecha);
	    promedio.hsTiposDatos.get(property).add(obj.tipoDato);
	}
	private void processData(Date fechaInicial, Date fechaFinal, HashMap<String, ItemPromedio> promedios) throws Exception
	{
		HashMap<String, Object> obj = new HashMap<String, Object>();
		obj.put("fechaInicio", FMT3.format(fechaInicial));
		obj.put("fechaTermino", FMT3.format(fechaFinal));
		for (String key: promedios.keySet()) {
			
			ItemPromedio promedio = promedios.get(key);
			for (String tipo : promedio.hsUfIds.keySet()) {
				int n = promedio.hsUfIds.get(tipo).size();
				System.out.println("Generando promedios para:" + key + ", tipo:" + tipo + ", size:" + n);
				if (n > 0)
				{					
					obj.put("tipo", tipo);
					obj.put("ufIds", promedio.hsUfIds.get(tipo));
					obj.put("procesoId", promedio.hsProcesoId.get(tipo));
					obj.put("dispositivoId", promedio.hsDispositivoId.get(tipo));
					obj.put("parametro", promedio.hsParametro.get(tipo));
					obj.put("valor", promedio.hsValor.get(tipo));
					obj.put("unidad", promedio.hsUnidad.get(tipo));
					obj.put("fecha", promedio.hsFecha.get(tipo));
					obj.put("tiposDatos", promedio.hsTiposDatos.get(tipo));
					
					JSONObject json = new JSONObject();
					json.put("data", obj);
					
					File tmp = File.createTempFile("Promedios_", ".json");
					FileWriter fw = new FileWriter(tmp);
					json.write(fw);
					fw.close();
					
					System.out.println("genero archivo exitosamente:" + tmp.getPath());
					String result = Util.sendPostData(PropertyUtil.getProperty("dlab.pid.python.calculapromedios.url"), new Param("data", tmp.getPath())); 
					if (result.startsWith("ERROR"))
					{
						throw new Exception(result);
					}
				}
			}
			promedio.hsUfIds.clear();
			promedio.hsProcesoId.clear();
			promedio.hsDispositivoId.clear();
			promedio.hsParametro.clear();
			promedio.hsValor.clear();
			promedio.hsUnidad.clear();
			promedio.hsFecha.clear();
			promedio.hsTiposDatos.clear();
			System.gc();
		}
	}
	@SuppressWarnings("unchecked")
	public void calculaPromedios(MongoCollection<Document> collection, Date fechaInicial, Date fechaTermino, boolean allRecords, HashMap<String, HashMap<String, Object>> allLimites) throws Exception
	{
		logger.info("***************************************************************************");
		logger.info("Entra a GeneraPromedios");
		logger.info("***************************************************************************");
	
		long t = System.currentTimeMillis();
		FindIterable<Document> find = collection.find(getFilter(fechaInicial, fechaTermino));
		MongoCursor<Document> cursor = find.iterator();
		long numRows = 0;
		
		String mes = FMT_MES.format(fechaInicial);
				
		HashMap<String, ItemPromedio> promedios = new HashMap<String, ItemPromedio>();
		Limites limites = new Limites(allLimites);
		HashMap<String, Integer> objects = new HashMap<String, Integer>();
		try
		{
			while (cursor.hasNext())
			{
				Document doc = cursor.next();
				ArrayList<Document> datas = (ArrayList<Document>) doc.get("data");
				for (Document data : datas)
				{
					ArrayList<Document> parametros = (ArrayList<Document>)data.get("Parametros");
					for (Document param : parametros)
					{
						++numRows;
						if (numRows % 1000000 == 0)
						{
							System.out.println("numregistros leidos:" + numRows);
						}
		                Date estampaTiempo = param.getDate("estampaTiempo");
                        if (!allRecords)
                        {
                        	if (!mes.equals(FMT_MES.format(estampaTiempo)))
                                continue;
                        }
                        
                        String crudo = getPropertyValue(param, "Crudo");
                        String validado = getPropertyValue(param, "Validados");
                        if (crudo.equals("DC") || validado.equals("DV"))
                		{
                        	Item obj = new Item(doc.getInteger("UfId"), doc.getInteger("ProcesoId")
                        						, data.getInteger("dispositivoId"), param.getString("nombre")
                        						, param.getDouble("valor"), param.getString("unidad"), estampaTiempo, null);
                        	
                        	ItemPromedio promedio = promedios.get(obj.idPromedio);
                        	if (promedio == null)
                        	{
                        		promedios.put(obj.idPromedio, promedio = new ItemPromedio());
                        	}
                        	if (!validado.equals("nan"))
                        	{
                        		obj.tipoDato = validado;
                        		limites.validaLimite(obj, true);
                        		addValue("validados", promedio, obj);
                        		Integer index = objects.get(obj.id);
                        		if (index != null)
                        		{
                                    promedio.hsUfIds.get("mixtos").set(index, obj.ufId);
                                    promedio.hsProcesoId.get("mixtos").set(index, obj.procesoId);
                                    promedio.hsDispositivoId.get("mixtos").set(index, obj.dispositivoId);
                                    promedio.hsParametro.get("mixtos").set(index, obj.parametro);
                                    promedio.hsValor.get("mixtos").set(index, obj.valor);
                                    promedio.hsUnidad.get("mixtos").set(index, obj.unidad);
                                    promedio.hsFecha.get("mixtos").set(index, obj.fecha);
                                    promedio.hsTiposDatos.get("mixtos").set(index, obj.tipoDato);
                                    continue;
                        			
                        		}
                        		else
                        		{
                        			objects.put(obj.id, promedio.hsUfIds.get("mixtos").size());
                        		}
                        	}
                        	else //datos crudos
                        	{
                        		obj.tipoDato = crudo;
                        		limites.validaLimite(obj, false);
                        		addValue("crudos", promedio, obj);
                        		Integer index = objects.get(obj.id);
                        		if (index != null)
                        		{
                        			continue;
                        		}
                        		else
                        		{
                        			objects.put(obj.id, promedio.hsUfIds.get("mixtos").size());
                        		}
                        	}
                        	addValue("mixtos", promedio, obj);
                		}
						
					}
					
				}
				
			}
			limites.notificar();
		    if (!allRecords)
		    {
		    	Calendar cal = Calendar.getInstance();
		    	cal.setTime(fechaInicial);
		    	cal.add(Calendar.MONTH, 1);
		    	fechaTermino = cal.getTime();
		    }
		    System.out.println("total de registros leidos:" + numRows + " en:" + (System.currentTimeMillis() - t) + " ms");
		    processData(fechaInicial, fechaTermino, promedios);
			
		}
		finally
		{
			cursor.close();
		}
		logger.info("Termina de leer en:" + (System.currentTimeMillis() - t) + " ms, numrows:" + numRows);
		
	    promedios.clear();
		if (numRows > 0)
		{
			System.gc();
		}

	}	
	
	public static void main(String[] args) throws Exception{
		PropertyUtil.load("calidaddelaire.properties");
		new GeneraPromedios().calculaUltimosPromedios();
	}
}
