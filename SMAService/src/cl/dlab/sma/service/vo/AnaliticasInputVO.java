package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class AnaliticasInputVO extends InputVO {

	@Override
	public Class<AnaliticasOutputVO> getOutputClass() {
		return AnaliticasOutputVO.class;
	}
}