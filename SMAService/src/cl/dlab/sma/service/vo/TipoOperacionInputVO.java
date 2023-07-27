package cl.dlab.sma.service.vo;

public class TipoOperacionInputVO extends InputVO {

	@Override
	public Class<TipoOperacionOutputVO> getOutputClass() {
		return TipoOperacionOutputVO.class;
	}
}