import React from 'react';
import { LayoutMode, Product } from '@interface/common';
import { ProductDetailView } from './product-layout-view';
import { ProductDetailEdit } from './product-layout-edit';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { selectProductById, updateProductAction } from '@state/product';
import { store } from '@state/index';


type navParams = { id: number, layout: LayoutMode }

interface Props extends Navigation<navParams> {
  product: Product
  state: any
}

const s = StyleSheet.create({
  button: { margin: 10, fontSize: 20, padding: 10 },
  headerButton: { marginRight: 20, fontSize: 20 }
})

let latestProductRef: Product
const handleSave = (nav: any, layout: LayoutMode) => () => {
  if (layout === 'Edit') store.dispatch(updateProductAction(latestProductRef, () => nav.pop()))
  //else if (layout === 'Create') store.dispatch()
  nav.pop()
}

const updateProductRef = (product: Product) => { latestProductRef = product }

export class _ProductDetailScreen extends React.Component<Props> {
  componentDidMount() {
    this.setState({ layout: this.props.navigation.state.params.layout })
  }

  static navigationOptions = ({ navigation }: any) => {
    const { layout, id } = navigation.state.params
    const options: any = { title: `${layout} Product` }
    if (layout === 'View') options.headerRight = (
      <TouchableOpacity style={s.headerButton} onPress={() => navigation.push('ProductDetail', { id, layout: 'Edit' })}>
        <Text>Edit</Text>
      </TouchableOpacity>
    )
    else options.headerRight = (
      <TouchableOpacity style={s.headerButton} onPress={handleSave(navigation, layout)}>
        <Text>Save</Text>
      </TouchableOpacity>
    )
    return options;
  };

  render() {
    const { product } = this.props
    const { layout } = this.props.navigation.state.params
    return (
      <>
        {layout == 'Create' && <ProductDetailEdit product={{}} sendLatestChanges={updateProductRef} />}
        {layout == 'View' && <ProductDetailView product={product} />}
        {layout == 'Edit' && <ProductDetailEdit product={product} sendLatestChanges={updateProductRef} />}
      </>

    );
  }
}

const mapStateToProps = (state: any, ownProps: Props) => ({
  product: selectProductById(state, ownProps.navigation.getParam('id', null))
})

export const ProductDetailScreen = connect(mapStateToProps, null, null)(_ProductDetailScreen)