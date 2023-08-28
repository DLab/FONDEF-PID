package cl.dlab.sma.core;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;

import cl.dlab.sma.core.sql.rad.Estaciones;
import cl.dlab.sma.service.vo.EstacionesOutputVO;
import cl.dlab.sma.service.vo.InputVO;
import cl.dlab.sma.service.vo.RespuestaVO;

public class EstacionesService extends UnidadesMedicionService {

	private static final String SQL_ESTACIONES = "select rgd_id, rgd_descripcion, rgd_rut, est_id, est_descripcion, est_latitud, est_longitud, x.lmt_maximo "
			+ "from estaciones, regulados, datos_por_estacion"
			+ ", (select lmt_est_id, lmt_rgd_id, lmt_parametro, lmt_maximo "
			+ "from limites_aire group by lmt_est_id, lmt_rgd_id, lmt_parametro, lmt_maximo) as x "
			+ "where rgd_id = est_rgd_id "
			+ " and dpe_rgd_id = rgd_id "
			+ " and dpe_est_id = est_id "
			+ " and rgd_id = x.lmt_rgd_id "
			+ " and est_id = x.lmt_est_id "
			+ " and dpe_prm_codigo = x.lmt_parametro "
			+ " and dpe_prm_codigo = ? "
			+ " and dpe_tpo_codigo = ? "
			+ " and est_latitud is not null "
			+ " and est_longitud is not null "
			+ "group by rgd_id, rgd_descripcion, rgd_rut, est_id, est_descripcion, est_latitud, est_longitud, x.lmt_maximo ";
	
	public EstacionesService() {
		super();
	}

	public EstacionesService(Connection con) {
		super(con);
	}

	public RespuestaVO<EstacionesOutputVO> consultar(InputVO input)
			throws Exception {
		return new cl.dlab.sma.core.sql.rad.Estaciones(con, con == null)
				.consultar(input);
	}

	public HashMap<String, Object> consultar(
			java.util.HashMap<String, Object> input) throws Exception {
		return new cl.dlab.sma.core.sql.rad.Estaciones(con, true)
				.consultar(input);
	}

	public void eliminar(java.util.HashMap<String, Object> input)
			throws Exception {
		new cl.dlab.sma.core.sql.rad.Estaciones(con, true).eliminar(input);
	}

	public void guardar(java.util.HashMap<String, Object> input)
			throws Exception {
		new cl.dlab.sma.core.sql.rad.Estaciones(con, true).guardar(input);
	}
	@SuppressWarnings("unchecked")
	public HashMap<String, Object> getEstaciones(HashMap<String, Object> input) throws Exception
	{	
		/*try(PreparedStatement stmt = est.getConnection().prepareStatement("select rgd_id, rgd_descripcion, rgd_rut, est_id, est_descripcion, est_latitud, est_longitud "
				+ "from estaciones, regulados, datos_promedios "
				+ "where rgd_id = est_rgd_id and dpr_ufid = rgd_id and dpr_idproceso = est_id and dpr_prm_codigo = ? and dpr_tipo = ?"
				+ "group by rgd_id, rgd_descripcion, rgd_rut, est_id, est_descripcion, est_latitud, est_longitud "))
		*/
		Estaciones est = new Estaciones();
		try
		{
			String inicio = getFecha("inicio", input);
			String termino = getFecha("termino", input);
			boolean emptyDates = inicio == null && termino == null;
			HashMap<String, HashMap<String, Object>> hsAll = new HashMap<String, HashMap<String,Object>>();
			ArrayList<HashMap<String, Object>> arr = new ArrayList<HashMap<String,Object>>();
			String tipoDato = (String)((HashMap<String, Object>)input.get("tipoDato")).get("codigo");
			String fuente = (String)((HashMap<String, Object>)input.get("fuente")).get("codigo");
			String tipoOperacion = input.get("tipoOperacion") == null ? null : (String)input.get("tipoOperacion");
			//try(PreparedStatement stmt = est.getConnection().prepareStatement("select rgd_id, rgd_descripcion, rgd_rut, est_id, est_descripcion, est_latitud, est_longitud from estaciones, regulados where rgd_id = est_rgd_id"))
			
			//System.out.println(SQL_ESTACIONES);
			try(PreparedStatement stmt = est.getConnection().prepareStatement(SQL_ESTACIONES))
			{
				stmt.setString(1, tipoDato);
				stmt.setString(2, fuente);
				try(ResultSet rset = stmt.executeQuery()){
					while(rset.next()) {
						HashMap<String, Object> hs = new HashMap<String, Object>();
						hs.put("ufId", rset.getInt(1));
						hs.put("regulado", rset.getString(2));
						hs.put("rut", rset.getObject(3));
						hs.put("idProceso", rset.getInt(4));
						hs.put("estacion", rset.getString(5));
						hs.put("latitud", rset.getDouble(6));
						hs.put("longitud", rset.getDouble(7));
						hs.put("valorMaximo", rset.getDouble(8));
						hs.put("withData", emptyDates);
						arr.add(hs);
						String key = rset.getInt(1) + "_" + rset.getInt(4);
						hsAll.put(key, hs);
					}
				}
			}
			if (!emptyDates || tipoOperacion != null)
			{
				StringBuilder sql = new StringBuilder();
				String ope = "";
				boolean esUltValor = false;
				if (tipoOperacion != null && tipoOperacion.equals("Ultimo_Valor"))
				{
					esUltValor = true;
					sql.append("select x.dpr_ufid, x.dpr_idproceso, x.dpr_valor from datos_promedios x"
							+ ", (select dpr_ufid, dpr_idproceso, dpr_prm_codigo, dpr_tipo, max(dpr_fecha) dpr_fecha "
							+ "   from datos_promedios "
							+ "   group by dpr_ufid, dpr_idproceso, dpr_prm_codigo, dpr_tipo) y "
							+ " where x.dpr_ufid = y.dpr_ufid and x.dpr_idproceso = y.dpr_idproceso and x.dpr_prm_codigo = y.dpr_prm_codigo and x.dpr_tipo = y.dpr_tipo and x.dpr_fecha = y.dpr_fecha and  ");
				}
				else if (tipoOperacion != null)
				{
					if (tipoOperacion.equals("Minimo")) {
						ope = ", min(dpr_valor)";
					}
					else if (tipoOperacion.equals("Maximo")) {
						ope = ", max(dpr_valor)";
					}
					else if (tipoOperacion.equals("Promedio")) {
						ope = ", avg(dpr_valor)";
					}
					else if (tipoOperacion.equals("Suma")) {
						ope = ", sum(dpr_valor)";
					}
				}
				if (!esUltValor)
				{
					sql.append("select x.dpr_ufid, x.dpr_idproceso").append(ope).append(" from datos_promedios x where ");
				}
				sql.append(" x.dpr_prm_codigo = ? and x.dpr_tipo = ? ");
				if (inicio != null)
				{
					sql.append(" and x.dpr_fecha >= '").append(inicio).append("'");
				}
				if (termino != null)
				{
					sql.append(" and x.dpr_fecha < '").append(termino).append("'");
				}
				if (!esUltValor)
				{
					sql.append(" group by x.dpr_ufid, x.dpr_idproceso");
				}
				System.out.println(sql);
				try(PreparedStatement stmt = est.getConnection().prepareStatement(sql.toString()))
				{
					HashMap<String, Object> hs;
					stmt.setString(1, tipoDato);
					stmt.setString(2, fuente);
					try(ResultSet rset = stmt.executeQuery()){
						while(rset.next()) {
							String key = rset.getInt(1) + "_" + rset.getInt(2);
							if ((hs = hsAll.get(key)) != null)
							{
								if (tipoOperacion != null)
								{
									hs.put("valor", rset.getDouble(3));
								}
								hs.put("withData", true);
							}
						}
					}
					
				}
			}
			HashMap<String, Object> result = new HashMap<String, Object>();
			result.put("result", arr);
			return result;
		}
		finally
		{
			est.getConnection().close();
		}
	}	
}