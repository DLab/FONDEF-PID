package cl.dlab.sma.core;

import cl.dlab.sma.core.BaseService;
import java.sql.Connection;
import cl.dlab.sma.service.vo.RespuestaVO;
import cl.dlab.sma.service.vo.TipoOperacionOutputVO;
import cl.dlab.sma.service.vo.InputVO;
import java.util.HashMap;

public class TipoOperacionService extends BaseService {

	public TipoOperacionService() {
		super();
	}

	public TipoOperacionService(Connection con) {
		super(con);
	}

	public RespuestaVO<TipoOperacionOutputVO> consultar(InputVO input)
			throws Exception {
		return new cl.dlab.sma.core.sql.rad.TipoOperacion(con, con == null)
				.consultar(input);
	}

	public HashMap<String, Object> consultar(
			java.util.HashMap<String, Object> input) throws Exception {
		return new cl.dlab.sma.core.sql.rad.TipoOperacion(con, true)
				.consultar(input);
	}

	public void eliminar(java.util.HashMap<String, Object> input)
			throws Exception {
		new cl.dlab.sma.core.sql.rad.TipoOperacion(con, true).eliminar(input);
	}

	public void guardar(java.util.HashMap<String, Object> input)
			throws Exception {
		new cl.dlab.sma.core.sql.rad.TipoOperacion(con, true).guardar(input);
	}
}