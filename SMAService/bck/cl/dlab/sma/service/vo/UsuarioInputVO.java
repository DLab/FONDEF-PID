package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class UsuarioInputVO extends InputVO {

	@Override
	public Class<UsuarioOutputVO> getOutputClass() {
		return UsuarioOutputVO.class;
	}
}