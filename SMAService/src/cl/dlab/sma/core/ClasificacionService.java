package cl.dlab.sma.core;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;

import cl.dlab.sma.core.sql.rad.Clasificacion;
import cl.dlab.sma.service.vo.ClasificacionOutputVO;
import cl.dlab.sma.service.vo.InputVO;
import cl.dlab.sma.service.vo.RespuestaVO;

public class ClasificacionService extends BaseService {

	public ClasificacionService() {
		super();
	}

	public ClasificacionService(Connection con) {
		super(con);
	}

	public RespuestaVO<ClasificacionOutputVO> consultar(InputVO input) throws Exception {
		return new Clasificacion(con, con == null).consultar(input);
	}

	public ArrayList<HashMap<String, Object>> consultar(java.util.HashMap<String, Object> input) throws Exception {
		
		Clasificacion clasificacion = new Clasificacion(con, false);
		try
		{
			String reino = (String)input.get("reino");
			String filodivision = (String)input.get("filodivision");
			String clase = (String)input.get("clase");
			String orden = (String)input.get("orden");
			String familia = (String)input.get("familia");
			String genero = (String)input.get("genero");
			
			StringBuilder where = new StringBuilder("");
			ArrayList<String> params = new ArrayList<String>();
			String groupBy = "reino";
			String and = "";
			
			if (reino != null)
			{
				where.append("reino = ? ");
				params.add(reino);
				groupBy = "filodivision";
				and = " and ";
			}
			if (filodivision != null)
			{
				where.append(and).append("filodivision = ? ");
				params.add(filodivision);
				groupBy = "clase";
				and = " and ";
			}
			if (clase != null)
			{
				where.append(and).append("clase = ? ");
				params.add(clase);
				groupBy = "orden";
				and = " and ";
			}
			if (orden != null)
			{
				where.append(and).append("orden = ? ");
				params.add(orden);
				groupBy = "familia";
				and = " and ";
			}
			if (familia != null)
			{
				where.append(and).append("familia = ? ");
				params.add(familia);
				groupBy = "genero";
				and = " and ";
			}
			if (genero != null)
			{
				where.append(and).append("genero = ? ");
				params.add(genero);
				groupBy = "epitetoespecifico";
				and = " and ";
			}
			StringBuilder sql = new StringBuilder("select ");
			sql.append(groupBy).append(" from " + clasificacion.getEntity().getTableName());
			if (where.length() > 0)
			{
				sql.append(" where ").append(where);
			}
			sql.append(" group by ").append(groupBy).append(" order by ").append(groupBy);
			System.out.println("sql:" + sql);
			try(PreparedStatement stmt = clasificacion.getConnection().prepareStatement(sql.toString()))
			{
				ArrayList<HashMap<String, Object>> list = new ArrayList<HashMap<String,Object>>();
				int i = 0;
				for (String param : params) {
					stmt.setString(++i, param);
				}
				try(ResultSet rset = stmt.executeQuery())
				{
					while(rset.next())
					{
						HashMap<String, Object> hs = new HashMap<String, Object>(input);
						String s = rset.getString(1);
						if (s != null && s.trim().length() > 0)
						{
							hs.put("codigo", s);
							hs.put("descripcion", s);
							list.add(hs);
						}
					}
				}
				return list;
			}
			
		}
		finally
		{
			clasificacion.getConnection().close();
		}
	}

	public void eliminar(java.util.HashMap<String, Object> input) throws Exception {
		new Clasificacion(con, true).eliminar(input);
	}

	public void guardar(java.util.HashMap<String, Object> input) throws Exception {
		new Clasificacion(con, true).guardar(input);
	}
}