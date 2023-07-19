package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class AccionInputVO extends InputVO {

	@Override
	public Class<AccionOutputVO> getOutputClass() {
		return AccionOutputVO.class;
	}
}