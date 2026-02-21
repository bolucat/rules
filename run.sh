#!/bin/bash
# 2021-2026 @bolucat 
# Credits: https://github.com/Loyalsoldier/clash-rules
# 	   https://github.com/DivineEngine/Profiles
#	   https://github.com/cobaltdisco/Google-Chinese-Results-Blocklist
#	   https://github.com/dallaslu/penzai-list
#	   https://github.com/privacy-protection-tools/anti-AD
#	   https://github.com/vernesong/OpenClash
#	   https://github.com/17mon/china_ip_list
#	   https://github.com/xinggsf/Adblock-Plus-Rule
#	   https://github.com/easylist/easylist
#	   https://github.com/Hackl0us/GeoIP2-CN
#	   https://github.com/Infatuation-Fei/rule
#	   https://github.com/blackmatrix7/ios_rule_script
#	   https://github.com/bolucat/domain-list
#	   https://github.com/entr0pia/No-other-Search-in-Google-Search
#	   https://github.com/jdlingyu/ad-wars
#	   https://github.com/Cats-Team/AdRules
#	   https://github.com/uniartisan/adblock_list
#	   https://github.com/cjx82630/cjxlist
#	   https://github.com/Loyalsoldier/geoip
#	   https://github.com/badafans/better-cloudflare-ip
#	   https://github.com/Kimentanm/aptv
#	   https://gitlab.com/malware-filter/phishing-filter
#	   https://github.com/uBlockOrigin/uAssets
#	   https://easylist.to
#	   https://github.com/bpc-clone/bpc_updates
#	   https://github.com/ClearURLs/Rules
#	   https://github.com/immersive-translate/immersive-translate
#	   https://github.com/gkd-kit/subscription
#	   https://github.com/MetaCubeX/meta-rules-dat
#	   https://github.com/ignaciocastro/a-dove-is-dumb
#      https://cira.moedove.com/

OPTION=$1
CUR=${PWD}

clean() {
	rm -rf clash/Loyalsoldier \
	clash/ip-show-list \
	clash/anti-ad clash/openclash \
	clash/fei-rules clash/ios-rule-script \
 	clash/a-dove-is-dumb \
	clash/cf-ip clash/my/my-reject-*.yaml \
 	clash/meta-rules-dat
	rm -rf seo adblock iptv bpc clearurls userscripts
}

clash() {
	mkdir -p clash/Loyalsoldier clash/anti-ad clash/openclash clash/ip-show-list clash/cf-ip clash/meta-rules-dat
	# Loyalsoldier
	pushd clash/Loyalsoldier || exit 1
    	export LOY=$(wget -qO- https://api.github.com/repos/Loyalsoldier/clash-rules/tags | grep 'name' | cut -d\" -f4 | head -1)
    	wget -qO- https://api.github.com/repos/Loyalsoldier/clash-rules/releases/tags/${LOY} | jq ".assets[] | {browser_download_url}" -c | jq .browser_download_url -r | wget -q -i -
	popd || exit 1
	# DivineEngine
    	# pushd clash/DivineEngine || exit 1
    	# git clone --depth 1 -b master https://github.com/DivineEngine/Profiles Profiles
    	# mv Profiles/Clash/* . && rm -rf Profiles
	# sed $'/DOMAIN-SUFFIX,cn/d' -i RuleSet/China.yaml
    	# popd || exit 1
     	# meta-rules-dat
      	pushd clash/meta-rules-dat || exit 1
       	wget -qO- "https://api.github.com/repos/MetaCubeX/meta-rules-dat/contents/?ref=release" | jq ".[] | {download_url}" -c | jq .download_url -r | grep -v ".sha256sum" | wget -c -i -
	popd || exit 1
	# my
	pushd clash/my || exit 1
	touch my-reject-domain.yaml my-reject-ip.yaml
	# penzai
	wget -qO- https://raw.githubusercontent.com/dallaslu/penzai-list/main/Surge.txt > penzai-temp.txt
	cat penzai-temp.txt | grep -oE '([0-9]{1,3}[\.]){3}[0-9]{1,3}' > penzai-temp-ips.txt
	# delete ips
	export IPS=$(($(sed -n '$=' penzai-temp-ips.txt)+1))
	for ((i=1;i<${IPS};i++)); do
		export IP=$(sed -n "${i}p" penzai-temp-ips.txt)
		sed -i "/${IP}/d" penzai-temp.txt
	done
	cat penzai-temp.txt | sed $'s/^.//g' >> domain-list-temp.txt
	cat penzai-temp-ips.txt | sort | cut -d '.' -f 1-3 | sed $'s/$/&.0\/24/g' >> ip-list-temp.txt
	rm -rfv penzai-temp.txt penzai-temp-ips.txt
	# phishing-filter
	wget -qO- https://malware-filter.gitlab.io/malware-filter/phishing-filter-domains.txt > phishing-temp.txt
	# resolve some problems
	# delete 'mobile-verif.253.365.457.14.strangled.net' and its root domain
	# delete 'us-east-2.protection.sophos.com'
 	# delete 'ns.800.160.0.52-207-7-170.cprapid.com' and its root domain
	sed -i $"/strangled\.net/d" phishing-temp.txt
	sed -i $"/us-east-2\.protection\.sophos\.com/d" phishing-temp.txt
 	sed -i $"/cprapid\.com/d" phishing-temp.txt
	cat phishing-temp.txt | grep -oE '([0-9]{1,3}[\.]){3}[0-9]{1,3}' > phishing-temp-ips.txt
	# delete ips
	export IPS=$(($(sed -n '$=' phishing-temp-ips.txt)+1))
	for ((i=1;i<${IPS};i++)); do
		export IP=$(sed -n "${i}p" phishing-temp-ips.txt)
		sed -i "/${IP}/d" phishing-temp.txt
	done
	cat phishing-temp.txt | sed $'/^#/d' | sed $'s/\.$//' >> domain-list-temp.txt
	cat phishing-temp-ips.txt | sort | cut -d '.' -f 1-3 | sed $'s/$/&.0\/24/g' >> ip-list-temp.txt
	rm -rfv phishing-temp.txt phishing-temp-ips.txt
	# Google-Chinese-Results
	wget -qO- https://raw.githubusercontent.com/cobaltdisco/Google-Chinese-Results-Blocklist/master/GHHbD_perma_ban_list.txt > temp1.txt
	cat temp1.txt | grep -oE '([0-9]{1,3}[\.]){3}[0-9]{1,3}' > temp2.txt
	cat temp1.txt | grep "/" | cut -d\/ -f1 > temp3.txt
	# delete ips
	export IPS=$(($(sed -n '$=' temp2.txt)+1))
	for ((i=1;i<${IPS};i++)); do
		export IP=$(sed -n "${i}p" temp2.txt)
		sed -i "/${IP}/d" temp1.txt
	done
	# import ips
	cat temp2.txt | sort | cut -d '.' -f 1-3 | sed $'s/$/&.0\/24/g' >> ip-list-temp.txt
	# ip-list
	cat ip-list-temp.txt | sort | uniq > ip-list.txt
	echo "payload:" > my-reject-ip.yaml && cat ip-list.txt | sed $'s/^/  - \'/g' | sed $'s/$/&\'/g' >> my-reject-ip.yaml
	# import domains
	export DOMAINS=$(($(sed -n '$=' temp3.txt)+1))
	for ((i=1;i<${DOMAINS};i++)); do
		export DOMAIN=$(sed -n "${i}p" temp3.txt)
		sed -i "/${DOMAIN}/d" temp1.txt
	done
	cat temp3.txt >> temp1.txt
	cat temp1.txt | sort | uniq >> domain-list-temp.txt
	# other hosts
	wget -qO- https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.Dead/hosts | grep -E "^0\.0\.0\.0" | sed $'s/0.0.0.0[[:space:]]//g' | sed '/0.0.0.0/d' | sed $'s/#.*//g' >> domain-list-temp.txt
	wget -qO- https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.2o7Net/hosts | grep -E "^0\.0\.0\.0" | sed $'s/0.0.0.0[[:space:]]//g' | sed '/0.0.0.0/d' | sed $'s/#.*//g' | sed 's/\r$//g' >> domain-list-temp.txt
	wget -qO- https://raw.githubusercontent.com/AdAway/adaway.github.io/master/hosts.txt | grep -E "^127\.0\.0\.1" | sed $'s/127.0.0.1[[:space:]]//g' | sed '/127.0.0.1/d' | sed '/localhost/d' | sed $'s/#.*//g' >> domain-list-temp.txt
	wget -qO- https://raw.githubusercontent.com/StevenBlack/hosts/master/data/StevenBlack/hosts | grep -E "^0\.0\.0\.0" | sed $'s/0.0.0.0[[:space:]]//g' | sed '/0.0.0.0/d' | sed $'s/#.*//g' >> domain-list-temp.txt
	wget -qO- https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.Risk/hosts | grep -E "^0\.0\.0\.0" | sed $'s/0.0.0.0[[:space:]]//g' | sed '/0.0.0.0/d' | sed $'s/#.*//g' >> domain-list-temp.txt
	# exception
	sed '/herokuapp.com/d' -i domain-list-temp.txt
	sed '/cloud.tencent.com/d' -i domain-list-temp.txt
	# domain-list
	cat domain-list-temp.txt | sort | uniq > domain-list.txt
	echo "payload:" > my-reject-domain.yaml && cat domain-list.txt | sed $'s/^/  - \'+\./g' | sed $'s/$/&\'/g' >> my-reject-domain.yaml
	# delete temp files
	rm -rfv temp1.txt temp2.txt temp3.txt domain-list-temp.txt ip-list-temp.txt
	# china-ip-list
	wget https://raw.githubusercontent.com/17mon/china_ip_list/master/china_ip_list.txt -O china-ip-list.txt
	wget https://raw.githubusercontent.com/Hackl0us/GeoIP2-CN/release/CN-ip-cidr.txt -O geoip2-cn.txt
	# GeoIP2-CN.mmdb
	wget https://github.com/Hackl0us/GeoIP2-CN/raw/release/Country.mmdb -O GeoIP2.mmdb
	# GeoLite2-Country.mmdb
	wget "https://github.com/Loyalsoldier/geoip/blob/release/GeoLite2-Country.tar.gz?raw=true" -O GeoLite2-Country.tar.gz
	mkdir -p GeoLite2-Country
	tar -zxf GeoLite2-Country.tar.gz -C GeoLite2-Country/ --strip-components=1
	mv GeoLite2-Country/GeoLite2-Country.mmdb GeoLite2-Country.mmdb
	rm -rf GeoLite2-Country GeoLite2-Country.tar.gz
 	# Country.mmdb
  	wget https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb -O Country.mmdb
	popd || exit 1
	pushd clash/ip-show-list || exit 1
	git clone --depth 1 https://github.com/bolucat/domain-list domain-list
	mv domain-list/clash/* .
	rm -rf domain-list
	popd || exit 1
	pushd clash/anti-ad || exit 1
	wget https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-clash.yaml -O anti-ad.yaml
	sed '/activity.windows.com/d' -i anti-ad.yaml
	popd || exit 1
	# openclash
	pushd clash/openclash || exit 1
	wget -qO- "https://api.github.com/repos/vernesong/OpenClash/contents/luci-app-openclash/root/etc/openclash/custom" | jq ".[] | {download_url}" -c | jq .download_url -r | wget -c -i -
	rm -rf OpenClash/
	popd || exit 1
	# cf-ip
	pushd clash/cf-ip || exit 1
	wget https://www.baipiao.eu.org/cloudflare/ips-v4 -O ips-v4.txt
	wget https://www.baipiao.eu.org/cloudflare/ips-v6 -O ips-v6.txt
	wget https://www.baipiao.eu.org/cloudflare/colo -O colo.txt
	wget https://www.baipiao.eu.org/cloudflare/url -O url.txt
	wget https://raw.githubusercontent.com/badafans/better-cloudflare-ip/master/shell/cf.sh -O cf.sh
	wget "https://raw.githubusercontent.com/badafans/better-cloudflare-ip/master/batch/CF%E4%BC%98%E9%80%89IP-UTF8.bat" -O "CF.bat"
	wget https://raw.githubusercontent.com/badafans/better-cloudflare-ip/master/batch/RTT.bat -O "RTT.bat"
	wget https://raw.githubusercontent.com/badafans/better-cloudflare-ip/master/batch/CR2CRLF.exe -O "CR2CRLF.exe"
	popd || exit 1
	# import other repositories
	pushd clash || exit 1
	git clone --depth 1 https://github.com/Infatuation-Fei/rule fei-rules
	rm -rf fei-rules/.git
	git clone --depth 1 https://github.com/blackmatrix7/ios_rule_script ios-rule-script
	rm -rf ios-rule-script/.git
 	git clone --depth 1 https://github.com/ignaciocastro/a-dove-is-dumb a-dove-is-dumb
	rm -rf a-dove-is-dumb/.git
	popd || exit 1
	# https://cira.moedove.com/
	pushd clash || exit 1
	mkdir -p moedove
	wget https://cira.moedove.com/china_all_v4.txt -O moedove/china_all_v4.txt
	wget https://cira.moedove.com/china_all_v6.txt -O moedove/china_all_v6.txt
	wget https://cira.moedove.com/china_domestic_backbone_v4.txt -O moedove/china_domestic_backbone_v4.txt
	wget https://cira.moedove.com/china_domestic_backbone_v6.txt -O moedove/china_domestic_backbone_v6.txt
	wget https://cira.moedove.com/chinatelecom_global_v4.txt -O moedove/chinatelecom_global_v4.txt
	wget https://cira.moedove.com/chinatelecom_global_v6.txt -O moedove/chinatelecom_global_v6.txt
	wget https://cira.moedove.com/chinatelecom_v4.txt -O moedove/chinatelecom_v4.txt
	wget https://cira.moedove.com/chinatelecom_v6.txt -O moedove/chinatelecom_v6.txt
	wget https://cira.moedove.com/chinaunicom_global_v4.txt -O moedove/chinaunicom_global_v4.txt
	wget https://cira.moedove.com/chinaunicom_global_v6.txt -O moedove/chinaunicom_global_v6.txt
	wget https://cira.moedove.com/chinaunicom_v4.txt -O moedove/chinaunicom_v4.txt
	wget https://cira.moedove.com/chinaunicom_v6.txt -O moedove/chinaunicom_v6.txt
	wget https://cira.moedove.com/chinamobile_global_v4.txt -O moedove/chinamobile_global_v4.txt
	wget https://cira.moedove.com/chinamobile_global_v6.txt -O moedove/chinamobile_global_v6.txt
	wget https://cira.moedove.com/chinamobile_v4.txt -O moedove/chinamobile_v4.txt
	wget https://cira.moedove.com/chinamobile_v6.txt -O moedove/chinamobile_v6.txt
	wget https://cira.moedove.com/cernet_edu_v4.txt -O moedove/cernet_edu_v4.txt
	wget https://cira.moedove.com/cernet_edu_v6.txt -O moedove/cernet_edu_v6.txt
	popd || exit 1
}

seo() {
	mkdir -p seo
	pushd seo || exit 1
	wget -qO- https://raw.githubusercontent.com/cobaltdisco/Google-Chinese-Results-Blocklist/master/uBlacklist_subscription.txt > seo.txt
	wget -qO- https://raw.githubusercontent.com/cobaltdisco/Google-Chinese-Results-Blocklist/master/uBlacklist_match_patterns.txt >> seo.txt
	wget -qO- https://raw.githubusercontent.com/dallaslu/penzai-list/main/uBlacklist.txt >> seo.txt
	wget -qO- https://raw.githubusercontent.com/entr0pia/No-other-Search-in-Google-Search/master/main_rules.txt > no-other-search-in-google.txt
	popd || exit 1
}

adblock() {
	mkdir -p adblock
	pushd adblock || exit 1
	wget https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt -O AdGuard-DNS-Filter.txt
	wget https://easylist-downloads.adblockplus.org/easylistchina.txt -O Easylist-China.txt
	wget https://easylist.to/easylist/easyprivacy.txt -O Easylist-Privacy.txt
	wget https://easylist-downloads.adblockplus.org/antiadblockfilters.txt -O Adblock-Warning-Removal.txt
	wget https://secure.fanboy.co.nz/fanboy-annoyance_ubo.txt -O Fanboy-Annoyance.txt
	wget https://easylist.to/easylist/fanboy-social.txt -O Fanboy-Social.txt
	wget https://www.fanboy.co.nz/fanboy-antifacebook.txt -O Fanboy-Anti-Facebook.txt
	wget https://www.i-dont-care-about-cookies.eu/abp/ -O I-dont-care-about-cookies.txt
	wget https://raw.githubusercontent.com/Spam404/lists/master/adblock-list.txt -O Spam404.txt
	wget https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-easylist.txt -O Anti-AD-Easylist.txt
 	wget https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-adguard.txt -O Anti-AD-Adguard.txt
	wget https://raw.githubusercontent.com/xinggsf/Adblock-Plus-Rule/master/rule.txt -O Cheng-Feng.txt
	wget https://raw.githubusercontent.com/xinggsf/Adblock-Plus-Rule/master/mv.txt -O Cheng-Feng-mv.txt
	wget https://raw.githubusercontent.com/xinggsf/Adblock-Plus-Rule/master/ublock-dynamic-rule.txt -O Cheng-Feng-dynamic.txt
	echo "! Title: Peter Lowe's AD list" > Peter-Lowe-ads-list.txt && wget -qO- "https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext" >> Peter-Lowe-ads-list.txt
	echo "! Title: MVPS HOSTS file" > MVPS-Host.txt && wget -qO- "https://winhelp2002.mvps.org/hosts.txt" >> MVPS-Host.txt
	echo "! Title: AD-Wars" > Ad-Wars.txt && wget -qO- https://raw.githubusercontent.com/jdlingyu/ad-wars/master/hosts >> Ad-Wars.txt
	wget https://raw.githubusercontent.com/Cats-Team/AdRules/main/adblock_plus.txt -O Cats-Team-AdRules.txt
	wget https://raw.githubusercontent.com/uniartisan/adblock_list/master/adblock_plus.txt -O Uniartisan-Adblock-Plus.txt
	wget https://raw.githubusercontent.com/cjx82630/cjxlist/master/cjx-annoyance.txt -O CJX-Annoyance.txt
	wget https://ublockorigin.github.io/uAssetsCDN/filters/filters.min.txt -O uBlock-Fliters.txt
	wget https://ublockorigin.github.io/uAssetsCDN/filters/badware.min.txt -O uBlock-Badware.txt
	wget https://ublockorigin.github.io/uAssetsCDN/filters/lan-block.txt -O uBlock-Lan-Block.txt
	wget https://ublockorigin.github.io/uAssetsCDN/filters/privacy.min.txt -O uBlock-Privacy.txt
	wget https://ublockorigin.github.io/uAssetsCDN/filters/quick-fixes.min.txt -O uBlock-Quick-Fix.txt
	wget https://ublockorigin.github.io/uAssetsCDN/filters/resource-abuse.txt -O uBlock-Resource-Abuse.txt
	wget https://ublockorigin.github.io/uAssetsCDN/filters/unbreak.min.txt -O uBlock-Unbreak.txt
	wget https://ublockorigin.github.io/uAssetsCDN/filters/annoyances.min.txt -O uBlock-Annoyances.txt
	wget https://malware-filter.gitlab.io/malware-filter/phishing-filter-ag.txt -O Phishing-URL-Blocklist.txt
	wget https://malware-filter.gitlab.io/malware-filter/botnet-filter-ag.txt -O Botnet-Blocklist.txt
	wget https://malware-filter.gitlab.io/malware-filter/urlhaus-filter-ag-online.txt -O Malicious-URL-Blocklist.txt
	echo "! Title: Dan Pollocks hosts" > Dan-Pollocks-hosts.txt && wget -qO- https://someonewhocares.org/hosts/hosts >> Dan-Pollocks-hosts.txt
	wget https://raw.githubusercontent.com/List-KR/List-KR/master/filter-AdGuard.txt -O List-KR.txt
	wget https://easylist-downloads.adblockplus.org/ruadlist.txt -O RU-AdList.txt
 	echo "! Title: Adguard Base Filter" > AdGurad-Base.txt && wget -qO- https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_2_Base/filter.txt >> AdGurad-Base.txt
  	wget https://filters.adtidy.org/extension/ublock/filters/2_without_easylist.txt -O AdGurad-Base-Without-Easylist.txt
	wget https://filters.adtidy.org/extension/ublock/filters/224.txt -O AdGuard-Chinese.txt
	wget https://easylist.to/easylistgermany/easylistgermany.txt -O EasyList-Germany.txt
	wget https://filters.adtidy.org/extension/ublock/filters/7.txt -O AdGuard-Japanese.txt
	popd || exit 1
}

iptv() {
	mkdir -p iptv
	pushd iptv || exit 1
	wget https://raw.githubusercontent.com/Kimentanm/aptv/master/m3u/iptv.m3u -O china-aptv-iptv.m3u
	popd || exit 1
}

bpc() {
	mkdir -p bpc
	pushd bpc || exit 1
 	wget --content-disposition "https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript%2Fbpc.de.user.js"
  	wget --content-disposition "https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript%2Fbpc.en.user.js"
	wget --content-disposition "https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript%2Fbpc.es.pt.user.js"
	wget --content-disposition "https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript%2Fbpc.fi.se.user.js"
	wget --content-disposition "https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript%2Fbpc.fr.user.js"
	wget --content-disposition "https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript%2Fbpc.it.user.js"
	wget --content-disposition "https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript%2Fbpc.nl.user.js"
	wget "https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=bpc-paywall-filter.txt" -O bpc-paywall-filter.txt
 	wget --content-disposition "https://gitflic.ru/project/magnolia1234/bpc_uploads/blob/raw?file=bypass-paywalls-chrome-clean-master.zip"
	wget --content-disposition "https://gitflic.ru/project/magnolia1234/bpc_uploads/blob/raw?file=bypass-paywalls-firefox-clean-master.zip"
	wget --content-disposition "https://gitflic.ru/project/magnolia1234/bpc_uploads/blob/raw?file=bypass_paywalls_clean-latest.xpi"
	popd || exit 1
}

clearurls() {
	mkdir -p clearurls
	pushd clearurls || exit 1
	wget https://raw.githubusercontent.com/ClearURLs/Rules/master/data.min.json -O data.json
	wget https://raw.githubusercontent.com/ClearURLs/Rules/master/build_tools/minifyDataJSON.js -O minifyDataJSON.js
	jq 'del(.providers.google.rules[] | select(. == "atyp" or . == "bi[a-z]*" or . == "cad" or . == "dpr" or . == "ei" or . == "vet"))' data.json > data.min.json
	rm -rf data.json
	sha256sum data.min.json | awk '{print $1}' > rules.min.hash
	node minifyDataJSON.js "data.min.json" "data.minify.json"
	sha256sum data.minify.json | awk '{print $1}' > rules.minify.hash
	rm -rf minifyDataJSON.js
	popd || exit 1
}

userscripts() {
	mkdir -p userscripts
 	pushd userscripts || exit 1
  	wget https://github.com/immersive-translate/immersive-translate/releases/latest/download/immersive-translate.user.js -O immersive-translate.user.js
   	wget https://raw.githubusercontent.com/AIsouler/GKD_subscription/main/dist/AIsouler_gkd.json5 -O gkd-AIsouler-subscription.json
   	popd || exit 1
}

list() {
	# clash/Loyalsoldier
    	pushd clash/Loyalsoldier || exit 1
	echo "# clash/Loyalsoldier" > ${CUR}/README.md
    	for file in $(ls); do
      		echo "- [${file}](https://rules.neuq.de/clash/Loyalsoldier/${file})" >> ${CUR}/README.md
    	done
    	popd || exit 1
    	# clash/DivineEngine
    	pushd clash/DivineEngine/RuleSet || exit 1
	echo "# clash/DivineEngine" >> ${CUR}/README.md
    	for file in $(tree -f -J | grep "yaml" | cut -d\" -f8 | sed $'s/^.\///g' | sort | xargs); do
      		echo "- [${file}](https://rules.neuq.de/clash/DivineEngine/RuleSet/${file})" >> ${CUR}/README.md
    	done
    	popd || exit 1
     	# clash/meta-rules-dat
	pushd clash/meta-rules-dat || exit 1
	echo "# clash/meta-rules-dat" >> ${CUR}/README.md
    	for file in $(ls); do
      		echo "- [${file}](https://rules.neuq.de/clash/meta-rules-dat/${file})" >> ${CUR}/README.md
    	done
    	popd || exit 1
	# clash/my
	pushd clash/my || exit 1
	echo "# clash/my" >> ${CUR}/README.md
    	for file in $(ls); do
      		echo "- [${file}](https://rules.neuq.de/clash/my/${file})" >> ${CUR}/README.md
    	done
    	popd || exit 1
	# clash/anti-ad
    	pushd clash/anti-ad || exit 1
	echo "# clash/anti-ad" >> ${CUR}/README.md
    	for file in $(ls); do
      		echo "- [${file}](https://rules.neuq.de/clash/anti-ad/${file})" >> ${CUR}/README.md
    	done
    	popd || exit 1
	# clash/ip-show-list
    	pushd clash/ip-show-list || exit 1
	echo "# clash/ip-show-list" >> ${CUR}/README.md
    	for file in $(ls); do
      		echo "- [${file}](https://rules.neuq.de/clash/ip-show-list/${file})" >> ${CUR}/README.md
    	done
    	popd || exit 1
	# clash/openclash
    	pushd clash/openclash || exit 1
	echo "# clash/openclash" >> ${CUR}/README.md
    	for file in $(ls); do
      		echo "- [${file}](https://rules.neuq.de/clash/openclash/${file})" >> ${CUR}/README.md
    	done
    	popd || exit 1
	# clash/cf-ip
    	pushd clash/cf-ip || exit 1
	echo "# clash/cf-ip" >> ${CUR}/README.md
    	for file in $(ls); do
      		echo "- [${file}](https://rules.neuq.de/clash/cf-ip/${file})" >> ${CUR}/README.md
    	done
    	popd || exit 1
     	# clash/a-dove-is-dumb
    	pushd clash/a-dove-is-dumb || exit 1
	echo "# clash/a-dove-is-dumb" >> ${CUR}/README.md
    	for file in $(ls); do
      		echo "- [${file}](https://rules.neuq.de/clash/a-dove-is-dumb/${file})" >> ${CUR}/README.md
    	done
    	popd || exit 1
	# seo
    	pushd seo || exit 1
	echo "# seo" >> ${CUR}/README.md
    	for file in $(ls); do
      		echo "- [${file}](https://rules.neuq.de/seo/${file})" >> ${CUR}/README.md
    	done
    	popd || exit 1
	# adblock
    	pushd adblock || exit 1
	echo "# adblock" >> ${CUR}/README.md
    	for file in $(ls); do
      		echo "- [${file}](https://rules.neuq.de/adblock/${file})" >> ${CUR}/README.md
    	done
    	popd || exit 1
	# iptv
	pushd iptv || exit 1
	echo "# iptv" >> ${CUR}/README.md
	for file in $(ls); do
		echo "- [${file}](https://rules.neuq.de/iptv/${file})" >> ${CUR}/README.md
    	done
    	popd || exit 1
	# bpc
	pushd bpc || exit 1
	echo "# bypass-wall-clean" >> ${CUR}/README.md
	for file in $(ls); do
		echo "- [${file}](https://rules.neuq.de/bpc/${file})" >> ${CUR}/README.md
	done
	popd || exit 1
	# clearurls
        pushd clearurls || exit 1
        echo "# clearurls" >> ${CUR}/README.md
        for file in $(ls); do
                echo "- [${file}](https://rules.neuq.de/clearurls/${file})" >> ${CUR}/README.md
        done
        popd || exit 1
	# userscripts
	pushd userscripts || exit 1
 	echo "# userscripts" >> ${CUR}/README.md
        for file in $(ls); do
                echo "- [${file}](https://rules.neuq.de/userscripts/${file})" >> ${CUR}/README.md
        done
        popd || exit 1
}

purge() {
	# clash/Loyalsoldier
    	pushd clash/Loyalsoldier || exit 1
    	for file in $(ls); do
      		curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/clash/Loyalsoldier/${file}"
    	done
    	popd || exit 1
    	# clash/DivineEngine
    	pushd clash/DivineEngine/RuleSet || exit 1
    	for file in $(tree -f -J | grep "yaml" | cut -d\" -f8 | sed $'s/^.\///g' | sort | xargs); do
      		curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/clash/DivineEngine/RuleSet/${file}"
    	done
    	popd || exit 1
     	# clash/meta-rules-dat
	pushd clash/meta-rules-dat || exit 1
    	for file in $(ls); do
      		curl -i  "https://purge.jsdelivr.net/gh/bolucat/rules@master/clash/meta-rules-dat/${file}"
    	done
    	popd || exit 1
	# clash/my
	pushd clash/my || exit 1
    	for file in $(ls); do
      		curl -i  "https://purge.jsdelivr.net/gh/bolucat/rules@master/clash/my/${file}"
    	done
    	popd || exit 1
	# clash/anti-ad
    	pushd clash/anti-ad || exit 1
    	for file in $(ls); do
      		curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/clash/anti-ad/${file}"
    	done
    	popd || exit 1
	# clash/openclash
    	pushd clash/openclash || exit 1
    	for file in $(ls); do
      		curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/clash/openclash/${file}"
    	done
    	popd || exit 1
     	# clash/ip-show-list
    	pushd clash/ip-show-list || exit 1
    	for file in $(ls); do
      		curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/clash/ip-show-list/${file}"
    	done
    	popd || exit 1
	# clash/cf-ip
    	pushd clash/cf-ip || exit 1
    	for file in $(ls); do
      		curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/clash/cf-ip/${file}"
    	done
    	popd || exit 1
     	# clash/a-dove-is-dumb
    	pushd clash/a-dove-is-dumb || exit 1
    	for file in $(ls); do
      		curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/clash/a-dove-is-dumb/${file}"
    	done
    	popd || exit 1
	# seo
    	pushd seo || exit 1
    	for file in $(ls); do
      		curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/seo/${file}"
    	done
    	popd || exit 1
	# adblock
    	pushd adblock || exit 1
    	for file in $(ls); do
      		curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/adblock/${file}"
    	done
    	popd || exit 1
	# iptv
    	pushd iptv || exit 1
    	for file in $(ls); do
      		curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/iptv/${file}"
    	done
    	popd || exit 1
	# bpc
	pushd bpc || exit 1
        for file in $(ls); do
                curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/bpc/${file}"
        done
        popd || exit 1
	# clearurls
        pushd clearurls || exit 1
        for file in $(ls); do
                curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/clearurls/${file}"
        done
        popd || exit 1
	# userscripts
        pushd userscripts || exit 1
        for file in $(ls); do
                curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/userscripts/${file}"
        done
        popd || exit 1
}

case "$OPTION" in
    	--clean)
        	clean
        	;;
    	--clash)
        	clash
        	;;
    	--seo)
        	seo
        	;;
	--adblock)
		adblock
		;;
	--list)
		list
		;;
	--purge)
		purge
		;;	
	--all)
        	clean
		clash
		seo
		adblock
		iptv
		bpc
		clearurls
  		userscripts
		list
        	;;
    	*)
        	echo "Usage: $0 [--clean|--clash|--seo|--adblock|--list|--purge|--all]"
		exit 1
		;;
esac
