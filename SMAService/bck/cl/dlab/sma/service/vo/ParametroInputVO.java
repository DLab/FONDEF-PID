package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class ParametroInputVO extends InputVO {

	@Override
	public Class<ParametroOutputVO> getOutputClass() {
		return ParametroOutputVO.class;
	}
}