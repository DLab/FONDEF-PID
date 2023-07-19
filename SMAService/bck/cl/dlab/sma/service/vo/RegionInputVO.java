package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class RegionInputVO extends InputVO {

	@Override
	public Class<RegionOutputVO> getOutputClass() {
		return RegionOutputVO.class;
	}
}