package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class ValidacionesNormativasInputVO extends InputVO {

	@Override
	public Class<ValidacionesNormativasOutputVO> getOutputClass() {
		return ValidacionesNormativasOutputVO.class;
	}

	public void setCodigoTipoArchivo(java.lang.String codigoTipoArchivo) {
		set("codigoTipoArchivo", codigoTipoArchivo);
	}

	public String getCodigoTipoArchivo() {
		return get("codigoTipoArchivo");
	}
}