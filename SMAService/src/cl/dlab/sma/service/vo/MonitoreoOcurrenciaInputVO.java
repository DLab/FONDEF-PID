package cl.dlab.sma.service.vo;

public class MonitoreoOcurrenciaInputVO extends InputVO {

	@Override
	public Class<MonitoreoOcurrenciaOutputVO> getOutputClass() {
		return MonitoreoOcurrenciaOutputVO.class;
	}
}