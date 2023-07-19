package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class TipoDatoInputVO extends InputVO {

	@Override
	public Class<TipoDatoOutputVO> getOutputClass() {
		return TipoDatoOutputVO.class;
	}
}