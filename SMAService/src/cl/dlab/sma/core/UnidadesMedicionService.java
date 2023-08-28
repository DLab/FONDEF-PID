package cl.dlab.sma.core;

import java.sql.Connection;
import java.util.HashMap;

public class UnidadesMedicionService extends BaseService {

	public UnidadesMedicionService()
	{
	}
	public UnidadesMedicionService(Connection con)
	{
		super(con);
	}
	
	protected String getFecha(String property, HashMap<String, Object> input)
	{
		String fecha = (String)input.get(property);
		return fecha == null ? null : fecha.substring(0, 19).replace("T", " ");
	}

}
