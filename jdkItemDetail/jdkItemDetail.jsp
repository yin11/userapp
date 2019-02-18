    <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
        <%@ include file="/WEB-INF/pages/share/imppackage.jsp" %>
            <%
	String result = "";
    String act = request.getParameter("act");
	try{
		if("doGetShopDetail".equals(act)){
			result = doGetShopDetail(request,JDK_SHOP_DETAIL);
		}else if("doPostCharages".equals(act)){
			result = doPostCharages(request,JDK_CHANGE);
		}else if("doGetShortChain".equals(act)){
			result = doGetShortChain(request,JDK_SHORT_CHAIN);
		}else if("doPostCollectionAdd".equals(act)){
			result = doPostCollectionAdd(request,JDK_COLLECTTION_ADD);
		}else if("doPostCollectionCancel".equals(act)){
			result = doPostCollectionCancel(request,JDK_COLLECTTION_CANCEL);
		}else if("doPostCollectionState".equals(act)){
			result = doPostCollectionState(request,JDK_COLLECTTION_STATE);
		}
		out.write(result);
	}catch(Exception e){

	}finally{
		out.flush();
	}


%>
<%!String doGetShopDetail(HttpServletRequest request,String url) throws Exception{
	SortedMap<String,String> params = new TreeMap<String,String>();
	params.put("skuid",request.getParameter("skuid"));
	params.put("page","1");
	params.put("pageSize","200");
	return HttpUtils.doGet(url, getHeaders(request,params), params);
}

String doPostCharages(HttpServletRequest request,String url) throws Exception{
	SortedMap<String,String> params = new TreeMap<String,String>();
	params.put("feeNum",request.getParameter("feeNum"));
	params.put("userType",request.getParameter("userType"));
	params.put("phone",request.getParameter("phone"));
	params.put("userName",request.getParameter("userName"));
	return HttpUtils.doPost(url, params, getHeaders(request,params));
}

String doGetShortChain(HttpServletRequest request,String url) throws Exception{
	SortedMap<String,String> params = new TreeMap<String,String>();
	params.put("skuid",request.getParameter("skuid"));
	params.put("couponUrl",request.getParameter("couponUrl"));
	params.put("positionId",request.getParameter("positionId"));
	return HttpUtils.doGet(url,getHeaders(request,params), params);
}


String doPostCollectionAdd(HttpServletRequest request,String url) throws Exception{
	SortedMap<String,String> params = new TreeMap<String,String>();
	params.put("token",request.getParameter("token"));
	params.put("platform",request.getParameter("platform"));
	params.put("goodsId",request.getParameter("goodsId"));
	params.put("goodsUrl",request.getParameter("goodsUrl"));
	params.put("goodsName",request.getParameter("goodsName"));
	params.put("state",request.getParameter("state"));
	params.put("originalPrice",request.getParameter("originalPrice"));
	params.put("discountPrice",request.getParameter("discountPrice"));
	params.put("offerContent",request.getParameter("offerContent"));
	params.put("cover",request.getParameter("cover"));
	params.put("salesVolume",request.getParameter("salesVolume"));
	return HttpUtils.doPost(url, params, getHeaders(request,params));
}


String doPostCollectionCancel(HttpServletRequest request,String url) throws Exception{
	SortedMap<String,String> params = new TreeMap<String,String>();
	params.put("token",request.getParameter("token"));
	params.put("platform",request.getParameter("platform"));
	params.put("goodsId",request.getParameter("goodsId"));
	return HttpUtils.doPost(url, params, getHeaders(request,params));
}

String doPostCollectionState(HttpServletRequest request,String url) throws Exception{
	SortedMap<String,String> params = new TreeMap<String,String>();
	params.put("token",request.getParameter("token"));
	params.put("platform",request.getParameter("platform"));
	params.put("goodsId",request.getParameter("goodsId"));
	return HttpUtils.doPost(url, params, getHeaders(request,params));
}



Map<String, String> getHeaders(HttpServletRequest request,SortedMap<String,String> params) {
    Map<String, String> headMap = new HashMap<String, String>();
    headMap.put(HttpHeaders.USER_AGENT, request.getHeader(HttpHeaders.USER_AGENT));
    headMap.put("sec",makeSign(params));
    return headMap;
}



%>