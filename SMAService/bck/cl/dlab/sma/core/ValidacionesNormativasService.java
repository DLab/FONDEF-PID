package cl.dlab.sma.core;

import cl.dlab.sma.core.BaseService;
import java.sql.Connection;
import cl.dlab.sma.service.vo.RespuestaVO;
import cl.dlab.sma.service.vo.ValidacionesNormativasOutputVO;
import cl.dlab.sma.service.vo.InputVO;
import java.util.HashMap;

public class ValidacionesNormativasService extends BaseService {

	public ValidacionesNormativasService() {
		super();
	}

	public ValidacionesNormativasService(Connection con) {
		super(con);
	}

	public RespuestaVO<ValidacionesNormativasOutputVO> consultar(InputVO input)
			throws Exception {
		return new cl.dlab.sma.core.sql.rad.ValidacionesNormativas(con,
				con == null).consultar(input);
	}

	public HashMap<String, Object> consultar(
			java.util.HashMap<String, Object> input) throws Exception {
		return new cl.dlab.sma.core.sql.rad.ValidacionesNormativas(con, true)
				.consultar(input);
	}

	public void eliminar(java.util.HashMap<String, Object> input)
			throws Exception {
		new cl.dlab.sma.core.sql.rad.ValidacionesNormativas(con, true)
				.eliminar(input);
	}

	public void guardar(java.util.HashMap<String, Object> input)
			throws Exception {
		new cl.dlab.sma.core.sql.rad.ValidacionesNormativas(con, true)
				.guardar(input);
	}
}