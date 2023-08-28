package cl.dlab.sma.core;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;

import cl.dlab.sma.core.sql.rad.MonitoreoOcurrencia;
import cl.dlab.sma.service.vo.InputVO;
import cl.dlab.sma.service.vo.MonitoreoOcurrenciaOutputVO;
import cl.dlab.sma.service.vo.RespuestaVO;

public class MonitoreoOcurrenciaService extends UnidadesMedicionService {
	
	
	public MonitoreoOcurrenciaService() {
		super();
	}

	public MonitoreoOcurrenciaService(Connection con) {
		super(con);
	}

	public RespuestaVO<MonitoreoOcurrenciaOutputVO> consultar(InputVO input) throws Exception {
		return new MonitoreoOcurrencia(con, con == null).consultar(input);
	}

	public HashMap<String, Object> consultar(java.util.HashMap<String, Object> input) throws Exception {
		return new MonitoreoOcurrencia(con, true).consultar(input);
	}

	public void eliminar(java.util.HashMap<String, Object> input) throws Exception {
		new MonitoreoOcurrencia(con, true).eliminar(input);
	}

	public void guardar(java.util.HashMap<String, Object> input) throws Exception {
		new MonitoreoOcurrencia(con, true).guardar(input);
	}
	private String getCodigo(HashMap<String, Object> input, String key)
	{
		return (String)getProperty(input, "codigo", key);
	}
	@SuppressWarnings("unchecked")
	private Object getProperty(HashMap<String, Object> input, String property, String key)
	{
		HashMap<String, Object> hs = (HashMap<String, Object>)input.get(key);
		return hs == null ? null : hs.get(property);
	}
	private String getEspecie(String genero, String epiteto)
	{
		if (genero == null && epiteto == null)
		{
			return "n/a";
		}
		return genero == null ? epiteto : epiteto == null ? genero : genero + " " + epiteto;
	}
	public HashMap<String, Object> getMediciones(HashMap<String, Object> input) throws Exception
	{	
		/*try(PreparedStatement stmt = est.getConnection().prepareStatement("select rgd_id, rgd_descripcion, rgd_rut, est_id, est_descripcion, est_latitud, est_longitud "
				+ "from estaciones, regulados, datos_promedios "
				+ "where rgd_id = est_rgd_id and dpr_ufid = rgd_id and dpr_idproceso = est_id and dpr_prm_codigo = ? and dpr_tipo = ?"
				+ "group by rgd_id, rgd_descripcion, rgd_rut, est_id, est_descripcion, est_latitud, est_longitud "))
		*/
		MonitoreoOcurrencia serv = new MonitoreoOcurrencia();
		try
		{
			String inicio = getFecha("inicio", input);
			String termino = getFecha("termino", input);
			//boolean emptyDates = inicio == null && termino == null;
			String tipoOperacion = input.get("tipoOperacion") == null ? null : (String)input.get("tipoOperacion");
			String tipoDato = getCodigo(input, "tipoDato");
			
			String nombreComun = (String)input.get("nombreComun");
			Integer region = (Integer)getProperty(input, "id", "region");
			String reino = getCodigo(input, "reino");
			String filodivision = getCodigo(input, "filodivision");
			String clase = getCodigo(input, "clase");
			String orden = getCodigo(input, "orden");
			String familia = getCodigo(input, "familia");
			String genero = getCodigo(input, "genero");
			String epitetoespecifico = getCodigo(input, "epitetoespecifico");
			
			StringBuilder sql = new StringBuilder("select genero, epitetoespecifico, nombrecomun, latitud, longitud");
			String ope = "";
			boolean esUltimoValor = false;
			if (tipoOperacion != null)
			{
				if (tipoOperacion.equals("Minimo")) {
					ope = ", min(valor)";
				}
				else if (tipoOperacion.equals("Maximo") || tipoOperacion.equals("Ultimo_Valor")) {
					ope = ", max(valor)";
				}
				else if (tipoOperacion.equals("Promedio")) {
					ope = ", avg(valor)";
				}
				else if (tipoOperacion.equals("Suma")) {
					ope = ", sum(valor)";
				}
				else if (tipoOperacion.equals("Ultimo_Valor")) {
					ope = ", fecha";
					esUltimoValor = true;
				}
			}
			sql.append(ope).append(" from view_monitoreo_ocurrencia");
			StringBuilder where = new StringBuilder("");
			ArrayList<Object> params = new ArrayList<Object>();
			String and = "";
			
			
			if (tipoDato != null)
			{
				where.append(and).append("parametro = ? ");
				params.add(tipoDato);
				and = " and ";
			}
			if (region != null)
			{
				where.append(and).append("idregion = ? ");
				params.add(region);
				and = " and ";
			}
			if (nombreComun != null)
			{
				where.append(and).append("upper(nombrecomun) like ? ");
				params.add("%" + nombreComun.toUpperCase() + "%");
				and = " and ";
			}
			if (reino != null)
			{
				where.append(and).append("reino = ? ");
				params.add(reino);
				and = " and ";
			}
			if (filodivision != null)
			{
				where.append(and).append("filodivision = ? ");
				params.add(filodivision);
				and = " and ";
			}
			if (clase != null)
			{
				where.append(and).append("clase = ? ");
				params.add(clase);
				and = " and ";
			}
			if (orden != null)
			{
				where.append(and).append("orden = ? ");
				params.add(orden);
				and = " and ";
			}
			if (familia != null)
			{
				where.append(and).append("familia = ? ");
				params.add(familia);
				and = " and ";
			}
			if (genero != null)
			{
				where.append(and).append("genero = ? ");
				params.add(genero);
				and = " and ";
			}			
			if (epitetoespecifico != null)
			{
				where.append(and).append("epitetoespecifico = ? ");
				params.add(epitetoespecifico);
				and = " and ";
			}			
			if (inicio != null)
			{
				where.append(and).append("dpr_fecha >= ? ");
				params.add(inicio);
				and = " and ";
			}
			if (termino != null)
			{
				where.append(and).append("dpr_fecha < ? ");
				params.add(termino);
				and = " and ";
			}
			
			
			if (where.length() > 0)
			{
				sql.append(" where ").append(where);
			}
			sql.append(" group by genero, epitetoespecifico, nombrecomun, latitud, longitud");
			if (esUltimoValor) {
				sql.append(", fecha having fecha = max(fecha)");
			}
			System.out.println(sql);
			System.out.println(params);
			try(PreparedStatement stmt = serv.getConnection().prepareStatement(sql.toString()))
			{
				int i = 0;
				for (Object p : params) {
					stmt.setObject(++i, p);
				}
				boolean hasOpe = !ope.equals("");
				Double max = 0D;
				ArrayList<HashMap<String, Object>> arr = new ArrayList<HashMap<String,Object>>();
				try(ResultSet rset = stmt.executeQuery()){
					while(rset.next()) {
						Double valor;
						HashMap<String, Object> hs = new HashMap<String, Object>();
						hs.put("especie", getEspecie(rset.getString(1), rset.getString(2)));
						hs.put("nombreComun", rset.getString(3));
						hs.put("latitud", rset.getDouble(4));
						hs.put("longitud", rset.getDouble(5));
						if (esUltimoValor) {
							hs.put("fecha", rset.getString(7));
						}
						hs.put("withData", true);
						hs.put("valor", valor = hasOpe ? rset.getDouble(6) : null);
						if (valor != null && max < valor) {
							max = valor;
						}
						arr.add(hs);
					}
					
				}
				HashMap<String, Object> result = new HashMap<String, Object>();
				result.put("result", arr);
				result.put("max", max);
				return result;
				
			}
		}
		finally
		{
			serv.getConnection().close();
		}
	}		
}