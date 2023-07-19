package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class HojaDeDatosInputVO extends InputVO {

	@Override
	public Class<HojaDeDatosOutputVO> getOutputClass() {
		return HojaDeDatosOutputVO.class;
	}

	public void setCodigoTipoArchivo(java.lang.String codigoTipoArchivo) {
		set("codigoTipoArchivo", codigoTipoArchivo);
	}

	public String getCodigoTipoArchivo() {
		return get("codigoTipoArchivo");
	}
}