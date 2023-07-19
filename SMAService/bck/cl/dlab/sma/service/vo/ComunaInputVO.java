package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class ComunaInputVO extends InputVO {

	@Override
	public Class<ComunaOutputVO> getOutputClass() {
		return ComunaOutputVO.class;
	}
}