package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class TipoArchivoInputVO extends InputVO {

	@Override
	public Class<TipoArchivoOutputVO> getOutputClass() {
		return TipoArchivoOutputVO.class;
	}
}