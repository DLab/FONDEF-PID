package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class AccionesxFuncionRolInputVO extends InputVO {

	@Override
	public Class<AccionesxFuncionRolOutputVO> getOutputClass() {
		return AccionesxFuncionRolOutputVO.class;
	}

	public void setIdRol(java.lang.Integer idRol) {
		set("idRol", idRol);
	}

	public Integer getIdRol() {
		return get("idRol");
	}
}