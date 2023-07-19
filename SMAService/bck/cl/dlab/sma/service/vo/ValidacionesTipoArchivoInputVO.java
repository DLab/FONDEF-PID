package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class ValidacionesTipoArchivoInputVO extends InputVO {

	@Override
	public Class<ValidacionesTipoArchivoOutputVO> getOutputClass() {
		return ValidacionesTipoArchivoOutputVO.class;
	}

	public void setCodigoTipoArchivo(java.lang.String codigoTipoArchivo) {
		set("codigoTipoArchivo", codigoTipoArchivo);
	}

	public String getCodigoTipoArchivo() {
		return get("codigoTipoArchivo");
	}

	public void setNombreHojaDatos(java.lang.String nombreHojaDatos) {
		set("nombreHojaDatos", nombreHojaDatos);
	}

	public String getNombreHojaDatos() {
		return get("nombreHojaDatos");
	}
}