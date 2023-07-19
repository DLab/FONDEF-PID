package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class ReguladosInputVO extends InputVO {

	@Override
	public Class<ReguladosOutputVO> getOutputClass() {
		return ReguladosOutputVO.class;
	}

	public void setIdComuna(java.lang.Integer idComuna) {
		set("idComuna", idComuna);
	}

	public Integer getIdComuna() {
		return get("idComuna");
	}
}