package cl.dlab.sma.core;

import cl.dlab.sma.core.BaseService;
import java.sql.Connection;
import cl.dlab.sma.service.vo.RespuestaVO;
import cl.dlab.sma.service.vo.RolOutputVO;
import cl.dlab.sma.service.vo.InputVO;
import java.util.HashMap;

public class RolService extends BaseService {

	public RolService() {
		super();
	}

	public RolService(Connection con) {
		super(con);
	}

	public RespuestaVO<RolOutputVO> consultar(InputVO input) throws Exception {
		return new cl.dlab.sma.core.sql.rad.Rol(con, con == null)
				.consultar(input);
	}

	public HashMap<String, Object> consultar(
			java.util.HashMap<String, Object> input) throws Exception {
		return new cl.dlab.sma.core.sql.rad.Rol(con, true).consultar(input);
	}

	public void eliminar(java.util.HashMap<String, Object> input)
			throws Exception {
		new cl.dlab.sma.core.sql.rad.Rol(con, true).eliminar(input);
	}

	public void guardar(java.util.HashMap<String, Object> input)
			throws Exception {
		new cl.dlab.sma.core.sql.rad.Rol(con, true).guardar(input);
	}
}