package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.QueryVO;

public class UsuarioUnitaryInputVO extends QueryVO {

	@Override
	public String getQueryName() {
		return "unitary";
	}

	@Override
	public Class<UsuarioOutputVO> getOutputClass() {
		return UsuarioOutputVO.class;
	}

	public void setId(java.lang.String id) {
		set("id", id);
	}

	public String getId() {
		return get("id");
	}
}