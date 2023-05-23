package cl.dlab.pid.calidaddelaire;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.bson.conversions.Bson;

import com.mongodb.client.model.Filters;

import cl.dlab.pid.util.PropertyUtil;


public class ConsultaPorFecha extends GeneraArchivos
{
	private static SimpleDateFormat DATE_FMT = new SimpleDateFormat("dd-MM-yyyy");

	private Date fechaInicio;
	private Date fechaTermino;
		
	@Override
	protected Bson getFilter(Integer ufId)
	{
		Bson filter =  Filters.and(Filters.eq("UfId", ufId), Filters.gte("timestamp", fechaInicio.toInstant()), Filters.lt("timestamp", fechaTermino.toInstant()));
		System.out.println("Filter:" + filter);
		return filter;
	}
	

	public FileVO getFile(DataBase db, Integer ufId, String fechaInicio, String fechaTermino, String formato) throws Exception
	{
		this.fechaInicio = DATE_FMT.parse(fechaInicio);
		this.fechaTermino = DATE_FMT.parse(fechaTermino);
		
		FileVO file = super.getFile(db, ufId, null, this.fechaInicio, this.fechaTermino, formato);
		if (file != null)
		{
			File f = new File(file.getPathName());
			f.delete();		
			if (formato.equals("parquet"))
			{
				f = new File(file.getPathName().replace(".parquet", ""));
				f.delete();
		        String id = f.getName().split("[.]")[0].split("_UfId_")[1] + "/";
		        if (id.startsWith("H_"))
		        {
		        	id = id.substring(2);
		        }
		        String pathArchivos = PropertyUtil.getProperty(db.getKeyPathArchivos());
		        File dir = new File(pathArchivos + id);
		        for (File _f : dir.listFiles()) {
					_f.delete();
				}
		        dir.delete();
			}
		}
		return file;
	}
	public static void main(String[] args) throws Exception
	{
		PropertyUtil.load("calidaddelaire.properties");
		FileVO file = new ConsultaPorFecha().getFile(DataBase.ApiRest, 299, "02-02-2022", "03-02-2022", "csv");
		System.out.println(file.getName() + ".." + file.getBytes().length);
	}
}
