package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class TipoOperacionInputVO extends InputVO {

	@Override
	public Class<TipoOperacionOutputVO> getOutputClass() {
		return TipoOperacionOutputVO.class;
	}
}