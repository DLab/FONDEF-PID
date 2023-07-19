package cl.dlab.sma.core;

import cl.dlab.sma.core.BaseService;
import java.sql.Connection;
import cl.dlab.sma.service.vo.RespuestaVO;
import cl.dlab.sma.service.vo.ConsultaAccionesxFuncionOutputVO;
import cl.dlab.sma.service.vo.InputVO;

public class ConsultaAccionesxFuncionService extends BaseService {

	public ConsultaAccionesxFuncionService() {
		super();
	}

	public ConsultaAccionesxFuncionService(Connection con) {
		super(con);
	}

	public RespuestaVO<ConsultaAccionesxFuncionOutputVO> consultar(InputVO input)
			throws Exception {
		return new cl.dlab.sma.core.sql.rad.ConsultaAccionesxFuncion(con,
				con == null).consultar(input);
	}
}