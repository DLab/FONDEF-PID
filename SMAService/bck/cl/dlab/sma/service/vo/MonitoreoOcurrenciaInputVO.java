package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class MonitoreoOcurrenciaInputVO extends InputVO {

	@Override
	public Class<MonitoreoOcurrenciaOutputVO> getOutputClass() {
		return MonitoreoOcurrenciaOutputVO.class;
	}
}