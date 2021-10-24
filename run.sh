#!/bin/bash
# 2021 @bolucat
# Credits: https://github.com/Loyalsoldier/clash-rules
# 		   https://github.com/DivineEngine/Profiles
#		   https://github.com/cobaltdisco/Google-Chinese-Results-Blocklist
#		   https://github.com/dallaslu/penzai-list

OPTION=$1

clean() {
	rm -rfv clash/Loyalsoldier clash/DivineEngine clash/my/my-reject-*.yaml
    mkdir -p clash/Loyalsoldier clash/DivineEngine
	rm -rfv seo
	mkdir -p seo
}

clash() {
	pushd clash/Loyalsoldier || exit 1
    export LOY=$(wget -qO- https://api.github.com/repos/Loyalsoldier/clash-rules/tags | grep 'name' | cut -d\" -f4 | head -1)
    wget -qO- https://api.github.com/repos/Loyalsoldier/clash-rules/releases/tags/${LOY} | jq ".assets[] | {browser_download_url}" -c | jq .browser_download_url -r | wget -i -
    popd || exit 1
    pushd clash/DivineEngine || exit 1
    git clone -b master https://github.com/DivineEngine/Profiles Profiles
    mv Profiles/Clash/* . && rm -rf Profiles
    popd || exit 1
	pushd clash/my || exit 1
	echo "payload:" > my-reject-domain.yaml
	echo "payload:" > my-reject-ip.yaml
	wget -qO- https://raw.githubusercontent.com/dallaslu/penzai-list/main/Surge.txt | sed $'s/^.//g' | sed -e 's/^/  - DOMAIN-SUFFIX,/g' >> my-reject-domain.yaml
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
	cat temp2.txt | sed $'s/^/\'&/g; s/$/&\'/g' | sed -e 's/^/  - /g' >> my-reject-ip.yaml
	# import domains
	export DOMAINS=$(($(sed -n '$=' temp3.txt)+1))
	for ((i=1;i<${DOMAINS};i++)); do
		export DOMAIN=$(sed -n "${i}p" temp3.txt)
		sed -i "/${DOMAIN}/d" temp1.txt
	done
	cat temp3.txt >> temp1.txt
	cat temp1.txt | sed -e 's/^/  - DOMAIN-SUFFIX,/g' >> my-reject-domain.yaml
	# delete temp files
	rm -rfv temp1.txt temp2.txt temp3.txt
}

seo() {
	wget -qO- https://raw.githubusercontent.com/cobaltdisco/Google-Chinese-Results-Blocklist/master/uBlacklist_subscription.txt > seo.txt
	wget -qO- https://raw.githubusercontent.com/cobaltdisco/Google-Chinese-Results-Blocklist/master/uBlacklist_match_patterns.txt >> seo.txt
	wget -qO- https://raw.githubusercontent.com/dallaslu/penzai-list/main/uBlacklist.txt >> seo.txt
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
	--all)
        clean
		clash
		seo
        ;;
    *)
        echo "unsupported options" && exit 1
        ;;
esac