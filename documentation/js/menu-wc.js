'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">novo_projeto_nest documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-9494f50f67e76bf968d3a316fe86ffdacf805b51e8aea33ca6c644ed3c3616902fafbb0110561b00109fcee3871743ae8b0152f0d317a18822e8bf1c340eb699"' : 'data-bs-target="#xs-injectables-links-module-AppModule-9494f50f67e76bf968d3a316fe86ffdacf805b51e8aea33ca6c644ed3c3616902fafbb0110561b00109fcee3871743ae8b0152f0d317a18822e8bf1c340eb699"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-9494f50f67e76bf968d3a316fe86ffdacf805b51e8aea33ca6c644ed3c3616902fafbb0110561b00109fcee3871743ae8b0152f0d317a18822e8bf1c340eb699"' :
                                        'id="xs-injectables-links-module-AppModule-9494f50f67e76bf968d3a316fe86ffdacf805b51e8aea33ca6c644ed3c3616902fafbb0110561b00109fcee3871743ae8b0152f0d317a18822e8bf1c340eb699"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CenterModule.html" data-type="entity-link" >CenterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CenterModule-552fd2efbf046f09bf64b8e9bd72044d9e27bf052db87bc53099673209d5be8b0b657b742dc96b815f72d6b898300d21af93a70428158d34e51cb5c4dc54922f"' : 'data-bs-target="#xs-controllers-links-module-CenterModule-552fd2efbf046f09bf64b8e9bd72044d9e27bf052db87bc53099673209d5be8b0b657b742dc96b815f72d6b898300d21af93a70428158d34e51cb5c4dc54922f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CenterModule-552fd2efbf046f09bf64b8e9bd72044d9e27bf052db87bc53099673209d5be8b0b657b742dc96b815f72d6b898300d21af93a70428158d34e51cb5c4dc54922f"' :
                                            'id="xs-controllers-links-module-CenterModule-552fd2efbf046f09bf64b8e9bd72044d9e27bf052db87bc53099673209d5be8b0b657b742dc96b815f72d6b898300d21af93a70428158d34e51cb5c4dc54922f"' }>
                                            <li class="link">
                                                <a href="controllers/CenterController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CenterController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CenterModule-552fd2efbf046f09bf64b8e9bd72044d9e27bf052db87bc53099673209d5be8b0b657b742dc96b815f72d6b898300d21af93a70428158d34e51cb5c4dc54922f"' : 'data-bs-target="#xs-injectables-links-module-CenterModule-552fd2efbf046f09bf64b8e9bd72044d9e27bf052db87bc53099673209d5be8b0b657b742dc96b815f72d6b898300d21af93a70428158d34e51cb5c4dc54922f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CenterModule-552fd2efbf046f09bf64b8e9bd72044d9e27bf052db87bc53099673209d5be8b0b657b742dc96b815f72d6b898300d21af93a70428158d34e51cb5c4dc54922f"' :
                                        'id="xs-injectables-links-module-CenterModule-552fd2efbf046f09bf64b8e9bd72044d9e27bf052db87bc53099673209d5be8b0b657b742dc96b815f72d6b898300d21af93a70428158d34e51cb5c4dc54922f"' }>
                                        <li class="link">
                                            <a href="injectables/CenterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CenterService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigCenterModule.html" data-type="entity-link" >ConfigCenterModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ConfigCenterModule-09ac55f4b6430f5cd82620d397f5545296ea3836d3029a47bb36e9406e0f62d960cbafadd08ef15efcafe556c48faacbbe6f1723c55e3a157915de2c84be7a12"' : 'data-bs-target="#xs-injectables-links-module-ConfigCenterModule-09ac55f4b6430f5cd82620d397f5545296ea3836d3029a47bb36e9406e0f62d960cbafadd08ef15efcafe556c48faacbbe6f1723c55e3a157915de2c84be7a12"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ConfigCenterModule-09ac55f4b6430f5cd82620d397f5545296ea3836d3029a47bb36e9406e0f62d960cbafadd08ef15efcafe556c48faacbbe6f1723c55e3a157915de2c84be7a12"' :
                                        'id="xs-injectables-links-module-ConfigCenterModule-09ac55f4b6430f5cd82620d397f5545296ea3836d3029a47bb36e9406e0f62d960cbafadd08ef15efcafe556c48faacbbe6f1723c55e3a157915de2c84be7a12"' }>
                                        <li class="link">
                                            <a href="injectables/ConfigCenterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigCenterService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DrizzleModule.html" data-type="entity-link" >DrizzleModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GestaoProdutividadeModule.html" data-type="entity-link" >GestaoProdutividadeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-GestaoProdutividadeModule-e7c7e56033c42fef38c7cdf629bb2efdeea074fd50407d4e962b69f7e2c6a2c03c337df1e62b5c542714efb87de9d935a2911f03a0c20d20d4b5c477864c7786"' : 'data-bs-target="#xs-controllers-links-module-GestaoProdutividadeModule-e7c7e56033c42fef38c7cdf629bb2efdeea074fd50407d4e962b69f7e2c6a2c03c337df1e62b5c542714efb87de9d935a2911f03a0c20d20d4b5c477864c7786"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GestaoProdutividadeModule-e7c7e56033c42fef38c7cdf629bb2efdeea074fd50407d4e962b69f7e2c6a2c03c337df1e62b5c542714efb87de9d935a2911f03a0c20d20d4b5c477864c7786"' :
                                            'id="xs-controllers-links-module-GestaoProdutividadeModule-e7c7e56033c42fef38c7cdf629bb2efdeea074fd50407d4e962b69f7e2c6a2c03c337df1e62b5c542714efb87de9d935a2911f03a0c20d20d4b5c477864c7786"' }>
                                            <li class="link">
                                                <a href="controllers/GestaoProdutividadeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GestaoProdutividadeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GestaoProdutividadeModule-e7c7e56033c42fef38c7cdf629bb2efdeea074fd50407d4e962b69f7e2c6a2c03c337df1e62b5c542714efb87de9d935a2911f03a0c20d20d4b5c477864c7786"' : 'data-bs-target="#xs-injectables-links-module-GestaoProdutividadeModule-e7c7e56033c42fef38c7cdf629bb2efdeea074fd50407d4e962b69f7e2c6a2c03c337df1e62b5c542714efb87de9d935a2911f03a0c20d20d4b5c477864c7786"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GestaoProdutividadeModule-e7c7e56033c42fef38c7cdf629bb2efdeea074fd50407d4e962b69f7e2c6a2c03c337df1e62b5c542714efb87de9d935a2911f03a0c20d20d4b5c477864c7786"' :
                                        'id="xs-injectables-links-module-GestaoProdutividadeModule-e7c7e56033c42fef38c7cdf629bb2efdeea074fd50407d4e962b69f7e2c6a2c03c337df1e62b5c542714efb87de9d935a2911f03a0c20d20d4b5c477864c7786"' }>
                                        <li class="link">
                                            <a href="injectables/CriarDemandaProdutividade.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CriarDemandaProdutividade</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GestaoProdutividadeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GestaoProdutividadeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RedisModule.html" data-type="entity-link" >RedisModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RedisModule-6b4b1a9a2f3e555f971413c50705ee594f4d47b081bd88486802892f055fb2b9d008efe89958623925881a3ba10e020d2959f599f25a794d38fe6e967df64a9b"' : 'data-bs-target="#xs-injectables-links-module-RedisModule-6b4b1a9a2f3e555f971413c50705ee594f4d47b081bd88486802892f055fb2b9d008efe89958623925881a3ba10e020d2959f599f25a794d38fe6e967df64a9b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RedisModule-6b4b1a9a2f3e555f971413c50705ee594f4d47b081bd88486802892f055fb2b9d008efe89958623925881a3ba10e020d2959f599f25a794d38fe6e967df64a9b"' :
                                        'id="xs-injectables-links-module-RedisModule-6b4b1a9a2f3e555f971413c50705ee594f4d47b081bd88486802892f055fb2b9d008efe89958623925881a3ba10e020d2959f599f25a794d38fe6e967df64a9b"' }>
                                        <li class="link">
                                            <a href="injectables/RedisService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RedisService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TransporteModule.html" data-type="entity-link" >TransporteModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TransporteModule-fecf3219613763eedee01e8ee83de219f023915d2e0a2044d444cb1ff53566e82f2699806eb4b09db503a83ada35c1d3a96dd26cce883fcf028252a980183188"' : 'data-bs-target="#xs-controllers-links-module-TransporteModule-fecf3219613763eedee01e8ee83de219f023915d2e0a2044d444cb1ff53566e82f2699806eb4b09db503a83ada35c1d3a96dd26cce883fcf028252a980183188"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TransporteModule-fecf3219613763eedee01e8ee83de219f023915d2e0a2044d444cb1ff53566e82f2699806eb4b09db503a83ada35c1d3a96dd26cce883fcf028252a980183188"' :
                                            'id="xs-controllers-links-module-TransporteModule-fecf3219613763eedee01e8ee83de219f023915d2e0a2044d444cb1ff53566e82f2699806eb4b09db503a83ada35c1d3a96dd26cce883fcf028252a980183188"' }>
                                            <li class="link">
                                                <a href="controllers/TransporteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransporteController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TransporteModule-fecf3219613763eedee01e8ee83de219f023915d2e0a2044d444cb1ff53566e82f2699806eb4b09db503a83ada35c1d3a96dd26cce883fcf028252a980183188"' : 'data-bs-target="#xs-injectables-links-module-TransporteModule-fecf3219613763eedee01e8ee83de219f023915d2e0a2044d444cb1ff53566e82f2699806eb4b09db503a83ada35c1d3a96dd26cce883fcf028252a980183188"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TransporteModule-fecf3219613763eedee01e8ee83de219f023915d2e0a2044d444cb1ff53566e82f2699806eb4b09db503a83ada35c1d3a96dd26cce883fcf028252a980183188"' :
                                        'id="xs-injectables-links-module-TransporteModule-fecf3219613763eedee01e8ee83de219f023915d2e0a2044d444cb1ff53566e82f2699806eb4b09db503a83ada35c1d3a96dd26cce883fcf028252a980183188"' }>
                                        <li class="link">
                                            <a href="injectables/TransporteService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransporteService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-9e8dec9fbaca67f5e5fc4fb0cc1b895cef6898518158bb55697cf329e432e5a5158524c84a5b4bff71301bbb2a4a2ab5680696be8d37da7ab03d75dc3b0e8586"' : 'data-bs-target="#xs-controllers-links-module-UserModule-9e8dec9fbaca67f5e5fc4fb0cc1b895cef6898518158bb55697cf329e432e5a5158524c84a5b4bff71301bbb2a4a2ab5680696be8d37da7ab03d75dc3b0e8586"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-9e8dec9fbaca67f5e5fc4fb0cc1b895cef6898518158bb55697cf329e432e5a5158524c84a5b4bff71301bbb2a4a2ab5680696be8d37da7ab03d75dc3b0e8586"' :
                                            'id="xs-controllers-links-module-UserModule-9e8dec9fbaca67f5e5fc4fb0cc1b895cef6898518158bb55697cf329e432e5a5158524c84a5b4bff71301bbb2a4a2ab5680696be8d37da7ab03d75dc3b0e8586"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-9e8dec9fbaca67f5e5fc4fb0cc1b895cef6898518158bb55697cf329e432e5a5158524c84a5b4bff71301bbb2a4a2ab5680696be8d37da7ab03d75dc3b0e8586"' : 'data-bs-target="#xs-injectables-links-module-UserModule-9e8dec9fbaca67f5e5fc4fb0cc1b895cef6898518158bb55697cf329e432e5a5158524c84a5b4bff71301bbb2a4a2ab5680696be8d37da7ab03d75dc3b0e8586"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-9e8dec9fbaca67f5e5fc4fb0cc1b895cef6898518158bb55697cf329e432e5a5158524c84a5b4bff71301bbb2a4a2ab5680696be8d37da7ab03d75dc3b0e8586"' :
                                        'id="xs-injectables-links-module-UserModule-9e8dec9fbaca67f5e5fc4fb0cc1b895cef6898518158bb55697cf329e432e5a5158524c84a5b4bff71301bbb2a4a2ab5680696be8d37da7ab03d75dc3b0e8586"' }>
                                        <li class="link">
                                            <a href="injectables/AddNewUser.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddNewUser</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AddUserBatch.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddUserBatch</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/CenterController.html" data-type="entity-link" >CenterController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/GestaoProdutividadeController.html" data-type="entity-link" >GestaoProdutividadeController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MyCustomController.html" data-type="entity-link" >MyCustomController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TransporteController.html" data-type="entity-link" >TransporteController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Center.html" data-type="entity-link" >Center</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ConfiguracaoImpressaoMapa.html" data-type="entity-link" >ConfiguracaoImpressaoMapa</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Transporte.html" data-type="entity-link" >Transporte</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserCenter.html" data-type="entity-link" >UserCenter</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AddItemsTransporteDto.html" data-type="entity-link" >AddItemsTransporteDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddPausaGeral.html" data-type="entity-link" >AddPausaGeral</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddPausaIndividual.html" data-type="entity-link" >AddPausaIndividual</a>
                            </li>
                            <li class="link">
                                <a href="classes/BuscarPausasAtivas.html" data-type="entity-link" >BuscarPausasAtivas</a>
                            </li>
                            <li class="link">
                                <a href="classes/CenterDto.html" data-type="entity-link" >CenterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CenterRepositoryDrizzle.html" data-type="entity-link" >CenterRepositoryDrizzle</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfiguracaoImpressaoMapa.html" data-type="entity-link" >ConfiguracaoImpressaoMapa</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfiguracaoImpressaoMapaDto.html" data-type="entity-link" >ConfiguracaoImpressaoMapaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTransporteDto.html" data-type="entity-link" >CreateTransporteDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTransporteItemDto.html" data-type="entity-link" >CreateTransporteItemDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriarFuncionarioKeyCloak.html" data-type="entity-link" >CriarFuncionarioKeyCloak</a>
                            </li>
                            <li class="link">
                                <a href="classes/Demanda.html" data-type="entity-link" >Demanda</a>
                            </li>
                            <li class="link">
                                <a href="classes/DemandaCreateDataComPaletesIds.html" data-type="entity-link" >DemandaCreateDataComPaletesIds</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditUserDto.html" data-type="entity-link" >EditUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FinalizarPaleteProdutividade.html" data-type="entity-link" >FinalizarPaleteProdutividade</a>
                            </li>
                            <li class="link">
                                <a href="classes/FinalizarPausaGeral.html" data-type="entity-link" >FinalizarPausaGeral</a>
                            </li>
                            <li class="link">
                                <a href="classes/FinalizarPausaIndividual.html" data-type="entity-link" >FinalizarPausaIndividual</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllTransportesDto.html" data-type="entity-link" >GetAllTransportesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InfoMeDto.html" data-type="entity-link" >InfoMeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Palete.html" data-type="entity-link" >Palete</a>
                            </li>
                            <li class="link">
                                <a href="classes/Pausa.html" data-type="entity-link" >Pausa</a>
                            </li>
                            <li class="link">
                                <a href="classes/PausaCreateDataDto.html" data-type="entity-link" >PausaCreateDataDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PausaGeralCreateDataDto.html" data-type="entity-link" >PausaGeralCreateDataDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PausaGeralGetDataDto.html" data-type="entity-link" >PausaGeralGetDataDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PausaGeralSearchParamsDto.html" data-type="entity-link" >PausaGeralSearchParamsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PausaRepositoryDrizzle.html" data-type="entity-link" >PausaRepositoryDrizzle</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProdutividadeRepositoryDrizzle.html" data-type="entity-link" >ProdutividadeRepositoryDrizzle</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueriesDtoUserCenter.html" data-type="entity-link" >QueriesDtoUserCenter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResultTransporteDto.html" data-type="entity-link" >ResultTransporteDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleDto.html" data-type="entity-link" >RoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCenterDto.html" data-type="entity-link" >UpdateCenterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTransporteDto.html" data-type="entity-link" >UpdateTransporteDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDto.html" data-type="entity-link" >UserDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AddNewUser.html" data-type="entity-link" >AddNewUser</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AddUserBatch.html" data-type="entity-link" >AddUserBatch</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CenterService.html" data-type="entity-link" >CenterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigCenterService.html" data-type="entity-link" >ConfigCenterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CriarDemandaProdutividade.html" data-type="entity-link" >CriarDemandaProdutividade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GestaoProdutividadeService.html" data-type="entity-link" >GestaoProdutividadeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KeycloakService.html" data-type="entity-link" >KeycloakService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RedisService.html" data-type="entity-link" >RedisService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransporteService.html" data-type="entity-link" >TransporteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/FindAllCentersQueryDto.html" data-type="entity-link" >FindAllCentersQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FindAllCentersQueryDto-1.html" data-type="entity-link" >FindAllCentersQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FindAllCentersQueryDto-2.html" data-type="entity-link" >FindAllCentersQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FindAllParams.html" data-type="entity-link" >FindAllParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetConfigMapaQueryDto.html" data-type="entity-link" >GetConfigMapaQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICenterRepository.html" data-type="entity-link" >ICenterRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDemandaProdutividadeRepository.html" data-type="entity-link" >IDemandaProdutividadeRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIdentityUserRepository.html" data-type="entity-link" >IIdentityUserRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPausaRepository.html" data-type="entity-link" >IPausaRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/KeycloakTokenPayload.html" data-type="entity-link" >KeycloakTokenPayload</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});