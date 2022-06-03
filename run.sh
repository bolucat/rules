#!/bin/bash
# 2021-2022 @bolucat
# Credits: https://github.com/Loyalsoldier/clash-rules
# 	   https://github.com/DivineEngine/Profiles
#	   https://github.com/cobaltdisco/Google-Chinese-Results-Blocklist
#	   https://github.com/dallaslu/penzai-list
#	   https://github.com/privacy-protection-tools/anti-AD
#	   https://github.com/vernesong/OpenClash
#	   https://github.com/17mon/china_ip_list
#	   https://github.com/xinggsf/Adblock-Plus-Rule
#	   https://github.com/Hackl0us/GeoIP2-CN
#	   https://github.com/Infatuation-Fei/rule
#	   https://github.com/blackmatrix7/ios_rule_script
#	   https://github.com/bolucat/domain-list

OPTION=$1
CUR=${PWD}

clean() {
	rm -rfv clash/Loyalsoldier clash/DivineEngine clash/ip-show-list clash/anti-ad clash/openclash clash/fei-rules clash/ios-rule-script clash/my/my-reject-*.yaml
	rm -rfv seo adblock
}

clash() {
	mkdir -p clash/Loyalsoldier clash/DivineEngine clash/anti-ad clash/openclash clash/ip-show-list
	# Loyalsoldier
	pushd clash/Loyalsoldier || exit 1
    	export LOY=$(wget -qO- https://api.github.com/repos/Loyalsoldier/clash-rules/tags | grep 'name' | cut -d\" -f4 | head -1)
    	wget -qO- https://api.github.com/repos/Loyalsoldier/clash-rules/releases/tags/${LOY} | jq ".assets[] | {browser_download_url}" -c | jq .browser_download_url -r | wget -i -
	popd || exit 1
	# DivineEngine
    	pushd clash/DivineEngine || exit 1
    	git clone -b master https://github.com/DivineEngine/Profiles Profiles
    	mv Profiles/Clash/* . && rm -rf Profiles
	sed $'/DOMAIN-SUFFIX,cn/d' -i RuleSet/China.yaml
    	popd || exit 1
	# my
	pushd clash/my || exit 1
	touch my-reject-domain.yaml my-reject-ip.yaml
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
	echo echo "payload:" > my-reject-ip.yaml && cat ip-list.txt | sed $'s/^/  - \'/g' | sed $'s/$/&\'/g' >> my-reject-ip.yaml
	# import domains
	export DOMAINS=$(($(sed -n '$=' temp3.txt)+1))
	for ((i=1;i<${DOMAINS};i++)); do
		export DOMAIN=$(sed -n "${i}p" temp3.txt)
		sed -i "/${DOMAIN}/d" temp1.txt
	done
	cat temp3.txt >> temp1.txt
	cat temp1.txt | sort | uniq | >> domain-list-temp.txt
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
	echo "payload:" > my-reject-domain.yaml && cat domain-list.txt | sed $'s/^/  - \'/g' | sed $'s/$/&\'/g' >> my-reject-domain.yaml
	# delete temp files
	rm -rfv temp1.txt temp2.txt temp3.txt domain-list-temp.txt ip-list-temp.txt
	# china-ip-list
	wget https://raw.githubusercontent.com/17mon/china_ip_list/master/china_ip_list.txt -O china-ip-list.txt
	wget https://raw.githubusercontent.com/Hackl0us/GeoIP2-CN/release/CN-ip-cidr.txt -O geoip2-cn.txt
	wget https://github.com/Hackl0us/GeoIP2-CN/raw/release/Country.mmdb -O GeoIP2.mmdb
	popd || exit 1
	pushd clash/ip-show-list || exit 1
	git clone https://github.com/bolucat/domain-list domain-list
	mv domain-list/clash/* .
	rm -rfv domain-list
	popd || exit 1
	pushd clash/anti-ad || exit 1
	wget https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-clash.yaml -O anti-ad.yaml
	sed '/activity.windows.com/d' -i anti-ad.yaml
	popd || exit 1
	# openclash
	pushd clash/openclash || exit 1
	git clone https://github.com/vernesong/OpenClash OpenClash
	mv OpenClash/luci-app-openclash/root/etc/openclash/custom/* .
	rm -rfv OpenClash/
	popd || exit 1
	# import other repositories
	pushd clash || exit 1
	git clone https://github.com/Infatuation-Fei/rule fei-rules
	rm -rf fei-rules/.git
	git clone https://github.com/blackmatrix7/ios_rule_script ios-rule-script
	rm -rf ios-rule-script/.git
	popd || exit 1
}

seo() {
	mkdir -p seo
	pushd seo || exit 1
	wget -qO- https://raw.githubusercontent.com/cobaltdisco/Google-Chinese-Results-Blocklist/master/uBlacklist_subscription.txt > seo.txt
	wget -qO- https://raw.githubusercontent.com/cobaltdisco/Google-Chinese-Results-Blocklist/master/uBlacklist_match_patterns.txt >> seo.txt
	wget -qO- https://raw.githubusercontent.com/dallaslu/penzai-list/main/uBlacklist.txt >> seo.txt
	popd || exit 1
}

adblock() {
	mkdir -p adblock
	pushd adblock || exit 1
	wget https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt -O AdGuard-Simplified-Domain-Names-Filter.txt
	wget https://easylist-downloads.adblockplus.org/easylistchina.txt -O Easylist-China.txt
	wget https://easylist.to/easylist/easyprivacy.txt -O Easylist-Privacy.txt
	wget https://www.i-dont-care-about-cookies.eu/abp/ -O I-dont-care-about-cookies.txt
	wget https://raw.githubusercontent.com/Spam404/lists/master/adblock-list.txt -O Spam404.txt
	wget https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-easylist.txt -O Anti-AD.txt
	wget https://raw.githubusercontent.com/xinggsf/Adblock-Plus-Rule/master/rule.txt -O Cheng-Feng.txt
	wget https://raw.githubusercontent.com/xinggsf/Adblock-Plus-Rule/master/mv.txt -O Cheng-Feng-mv.txt
	wget https://raw.githubusercontent.com/xinggsf/Adblock-Plus-Rule/master/ublock-dynamic-rule.txt -O Cheng-Feng-dynamic.txt
	echo "! Title: Peter Lowe's AD list" > Peter-Lowe-ads-list.txt && wget -qO- "https://pgl.yoyo.org/adservers/serverlist.php?showintro=0;hostformat=hosts" | sed '/</d' | sed '/^$/d' >> Peter-Lowe-ads-list.txt
	echo "! Title: MVPS HOSTS file" > MVPS-Host.txt && wget -qO- "https://winhelp2002.mvps.org/hosts.txt" >> MVPS-Host.txt
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
    	pushd clash/DivineEngine || exit 1
	echo "# clash/DivineEngine" >> ${CUR}/README.md
    	for file in $(tree -f -J | grep "yaml" | cut -d\" -f8 | sed $'s/^.\///g' | xargs); do
      		echo "- [${file}](https://rules.neuq.de/clash/DivineEngine/${file})" >> ${CUR}/README.md
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
}

purge() {
	# clash/Loyalsoldier
    	pushd clash/Loyalsoldier || exit 1
    	for file in $(ls); do
      		curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/clash/Loyalsoldier/${file}"
    	done
    	popd || exit 1
    	# clash/DivineEngine
    	pushd clash/DivineEngine || exit 1
    	for file in $(tree -f -J | grep "yaml" | cut -d\" -f8 | sed $'s/^.\///g' | xargs); do
      		curl -i "https://purge.jsdelivr.net/gh/bolucat/rules@master/clash/DivineEngine/${file}"
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
		list
        	;;
    	*)
        	echo "Usage: $0 [--clean|--clash|--seo|--adblock|--list|--purge|--all]"
		exit 1
		;;
esac
