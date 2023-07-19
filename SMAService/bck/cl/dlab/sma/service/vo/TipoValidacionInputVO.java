package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class TipoValidacionInputVO extends InputVO {

	@Override
	public Class<TipoValidacionOutputVO> getOutputClass() {
		return TipoValidacionOutputVO.class;
	}
}