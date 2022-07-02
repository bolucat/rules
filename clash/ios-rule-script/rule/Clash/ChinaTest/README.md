# 🧸 ChinaTest

## 前言

![](https://shields.io/badge/-移除重复规则-ff69b4) ![](https://shields.io/badge/-DOMAIN与DOMAIN--SUFFIX合并-green) ![](https://shields.io/badge/-DOMAIN--SUFFIX间合并-critical) ![](https://shields.io/badge/-DOMAIN--SUFFIX与DOMAIN--KEYWORD合并-blue) ![](https://shields.io/badge/-IP--CIDR(6)合并-blueviolet) 

ChinaTest规则由《RULE GENERATOR 规则生成器》自动生成。

分流规则是互联网公共服务的域名和IP地址汇总，所有数据均收集自互联网公开信息，不代表我们支持或使用这些服务。

请通过【中华人民共和国 People's Republic of China】合法的互联网出入口信道访问规则中的地址，并确保在使用过程中符合相关法律法规。

## 规则统计

最后更新时间：2022-07-02 02:31:55

各类型规则统计：
| 类型 | 数量(条)  | 
| ---- | ----  |
| DOMAIN | 88  | 
| DOMAIN-KEYWORD | 10  | 
| DOMAIN-SUFFIX | 66745  | 
| IP-CIDR | 10  | 
| IP-CIDR6 | 4  | 
| TOTAL | 66857  | 


## Clash 

#### 使用说明
- ChinaTest.yaml，请使用 behavior: "classical"。
- ChinaTest_Classical.yaml，请使用 behavior: "classical"。
- ChinaTest_Domain.yaml，请使用 behavior: "domain"。

#### 配置建议
- ChinaTest_Domain.yaml 单独使用。
- ChinaTest_Classical.yaml 单独使用。
- ChinaTest.yaml、ChinaTest_Domain.yaml 共同使用。

#### 规则链接
**MASTER分支 (每日更新)**

https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaTest/ChinaTest.yaml

https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaTest/ChinaTest_Classical.yaml

https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaTest/ChinaTest_Domain.txt

**MASTER分支 CDN (每日更新)**

https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/ChinaTest/ChinaTest.yaml

https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/ChinaTest/ChinaTest_Classical.yaml

https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/ChinaTest/ChinaTest_Domain.txt

**MASTER分支 GHProxy (每日更新)**

https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaTest/ChinaTest.yaml

https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaTest/ChinaTest_Classical.yaml

https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaTest/ChinaTest_Domain.txt

**RELEASE分支 (不定时更新)**

https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/ChinaTest/ChinaTest.yaml

https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/ChinaTest/ChinaTest_Classical.yaml

https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/ChinaTest/ChinaTest_Domain.txt

**RELEASE分支CDN (不定时更新)**

https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@release/rule/Clash/ChinaTest/ChinaTest.yaml

https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@release/rule/Clash/ChinaTest/ChinaTest_Classical.yaml

https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@release/rule/Clash/ChinaTest/ChinaTest_Domain.txt

**RELEASE分支 GHProxy (不定时更新)**

https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/ChinaTest/ChinaTest.yaml

https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/ChinaTest/ChinaTest_Classical.yaml

https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/ChinaTest/ChinaTest_Domain.txt

## 子规则/排除规则

当前分流规则，已包含以下子规则，除非特殊需求否则不建议重复引用：
| 子规则  | 
| ----  |
| China  | 


当前分流规则，已排除以下规则：
| 排除规则  |  | 
| ---- | ----  |
| Steam | SteamCN  | 

## 数据来源

《ChinaTest》的数据来自以下链接，如与本项目的《ChinaTest》规则混合使用，可能会造成规则大量重复。

- https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanAD.list
- https://raw.githubusercontent.com/NobyDa/ND-AD/master/Surge/AD_Block.txt
- https://raw.githubusercontent.com/NobyDa/Script/master/Surge/AdRule.list
- https://raw.githubusercontent.com/DivineEngine/Profiles/master/Surge/Ruleset/Guard/Advertising.list
- https://raw.githubusercontent.com/eHpo1/Rules/master/Surge4/Ruleset/Liby.list
- https://raw.githubusercontent.com/eHpo1/Rules/master/Surge4/Ruleset/Tide.list
- https://raw.githubusercontent.com/lhie1/Rules/master/Surge/Surge%203/Provider/Reject.list
- https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/source/rule/Advertising/Advertising.list
- https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/source/rule/Advertising/LianXiangJia/LianXiangJia.list
- https://raw.githubusercontent.com/NobyDa/ND-AD/master/QuantumultX/AD_Block.txt
- https://raw.githubusercontent.com/NobyDa/ND-AD/master/QuantumultX/AD_Block_Plus.txt
- https://raw.githubusercontent.com/NobyDa/ND-AD/master/Surge/AD_Block_Add.txt
- https://raw.githubusercontent.com/NobyDa/ND-AD/master/Surge/AD_Block_Plus.txt
- https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/AdRule.list
- https://raw.githubusercontent.com/DivineEngine/Profiles/master/Quantumult/Filter/Guard/Advertising.list
- https://raw.githubusercontent.com/eHpo1/Rules/master/QuantumultX/Filter/Liby.txt
- https://raw.githubusercontent.com/scomper/surge-list/master/reject.list
- https://raw.githubusercontent.com/scomper/surge-list/master/adblock.list
- https://raw.githubusercontent.com/nzw9314/Surge/master/Ruleset/Tide.list
- https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/source/connershua/Quantumult/X/Filter/Advertising.list
- https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyList.list
- https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyListChina.list
- https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanProgramAD.list
- https://raw.githubusercontent.com/787a68/Rules/master/Surge4/Ruleset/Tide.list
- https://raw.githubusercontent.com/limbopro/Adblock4limbo/main/Adblock4limbo.list
- https://raw.githubusercontent.com/Hackl0us/SS-Rule-Snippet/master/Rulesets/Surge/Custom/ad-domains.list
- https://raw.githubusercontent.com/Hackl0us/SS-Rule-Snippet/master/Rulesets/Surge/Custom/video-ad.list
- https://raw.githubusercontent.com/an0na/R/master/Filter/AdBlock.list
- https://raw.githubusercontent.com/sve1r/Rules-For-Quantumult-X/develop/Rules/Advertising/AdReject.list
- https://raw.githubusercontent.com/sve1r/Rules-For-Quantumult-X/develop/Rules/Advertising/Hijacking.list
- https://raw.githubusercontent.com/DivineEngine/Profiles/master/Surge/Ruleset/Guard/Hijacking.list
- https://raw.githubusercontent.com/DivineEngine/Profiles/master/Surge/Ruleset/Guard/Privacy.list
- https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyPrivacy.list
- https://raw.githubusercontent.com/DivineEngine/Profiles/master/Surge/Ruleset/Extra/Game/Steam.list
- https://raw.githubusercontent.com/lhie1/Rules/master/Surge/Surge%203/Provider/Steam.list
- https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Steam.list
- https://raw.githubusercontent.com/LM-Firefly/Rules/master/Game/Steam.list
- https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/SteamCN.list
- https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/source/rule/BlackList/BlackList.list
- https://raw.githubusercontent.com/lhie1/Rules/master/Surge/Surge%203/Provider/Proxy.list
- https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyGFWlist.list
- https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyLite.list
- https://raw.githubusercontent.com/Hackl0us/SS-Rule-Snippet/master/Rulesets/Surge/Basic/Apple-proxy.list
- https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/source/rule/Proxy/Proxy.list
- https://raw.githubusercontent.com/Loyalsoldier/surge-rules/release/ruleset/greatfire.txt
- https://raw.githubusercontent.com/Loyalsoldier/surge-rules/release/ruleset/gfw.txt
- https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/Filter/Outside.list
- https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/source/rule/WhiteList/WhiteList.list
- https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/UnBan.list
- https://raw.githubusercontent.com/DivineEngine/Profiles/master/Surge/Ruleset/Unbreak.list
- https://raw.githubusercontent.com/DivineEngine/Profiles/master/Quantumult/Filter/Unbreak.list
- https://raw.githubusercontent.com/sve1r/Rules-For-Quantumult-X/develop/Rules/Services/Unbreak.list
- https://raw.githubusercontent.com/DivineEngine/Profiles/master/Surge/Ruleset/China.list
- https://raw.githubusercontent.com/DivineEngine/Profiles/master/Quantumult/Filter/China.list
- https://raw.githubusercontent.com/lhie1/Rules/master/Surge/Surge%203/Provider/Domestic.list
- https://raw.githubusercontent.com/eHpo1/Rules/master/Surge4/Ruleset/Domestic.list
- https://raw.githubusercontent.com/Hackl0us/SS-Rule-Snippet/master/Rulesets/Surge/Basic/CN.list
- https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/source/rule/China/China.list
- https://raw.githubusercontent.com/GeQ1an/Rules/master/QuantumultX/Filter/Mainland.list
- https://raw.githubusercontent.com/sve1r/Rules-For-Quantumult-X/develop/Rules/Region/China.list
- https://raw.githubusercontent.com/Loyalsoldier/surge-rules/release/ruleset/direct.txt
- https://raw.githubusercontent.com/yjqiang/surge_scripts/main/modules/hupu/hupu.sgmodule
- https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/gfw.txt
- https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/greatfire.txt
- https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/reject.txt


感谢以上规则作者的辛勤付出（排名不分先后）。

## 最后

### 感谢

[@fiiir](https://github.com/fiiir) [@Tartarus2014](https://github.com/Tartarus2014) [@zjcfynn](https://github.com/zjcfynn) [@chenyiping1995](https://github.com/chenyiping1995) [@vhdj](https://github.com/vhdj)

提供规则数据源及改进建议。

### 其他

请不要对外宣传本项目。