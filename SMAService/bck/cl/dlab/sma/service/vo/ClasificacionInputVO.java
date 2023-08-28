package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class ClasificacionInputVO extends InputVO {

	@Override
	public Class<ClasificacionOutputVO> getOutputClass() {
		return ClasificacionOutputVO.class;
	}
}