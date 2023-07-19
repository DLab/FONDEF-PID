package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class EstacionesInputVO extends InputVO {

	@Override
	public Class<EstacionesOutputVO> getOutputClass() {
		return EstacionesOutputVO.class;
	}

	public void setIdRegulado(java.lang.Integer idRegulado) {
		set("idRegulado", idRegulado);
	}

	public Integer getIdRegulado() {
		return get("idRegulado");
	}
}