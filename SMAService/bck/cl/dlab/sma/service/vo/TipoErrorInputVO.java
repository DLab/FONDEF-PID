package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class TipoErrorInputVO extends InputVO {

	@Override
	public Class<TipoErrorOutputVO> getOutputClass() {
		return TipoErrorOutputVO.class;
	}
}