package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class BaseDatosInputVO extends InputVO {

	@Override
	public Class<BaseDatosOutputVO> getOutputClass() {
		return BaseDatosOutputVO.class;
	}
}