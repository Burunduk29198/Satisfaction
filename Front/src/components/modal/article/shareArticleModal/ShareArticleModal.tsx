import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'redux/reducers/rootReducer'
import {
    fetchArticleByIdAction,
    fetchUploadToGhost,
    fetchUploadToMedium,
} from 'modules/articles/store/actions'
import { SharedContainer } from 'style/general'
import Button from 'components/button'
import { ISharedValues, sharedValues } from '../config'
import { CustomModal } from '../../Modal'

interface IProps {
    open: boolean
    setOpen: ({ open, id }: { open: boolean; id: string }) => void
    id: string
}

const ShareArticleModal: FC<IProps> = ({ open, setOpen, id }) => {
    const dispatch = useDispatch()

    const [values, setValues] = useState<ISharedValues>(sharedValues)

    const { selectedArticle, isLaoding } = useSelector(
        ({ articles }: RootState) => ({
            selectedArticle: articles.selectedArticle,
            isLaoding: articles.isLoadingSelectedArticle,
        }),
    )
    const handleClose = () => {
        setOpen({ open: false, id: '' })
    }

    useEffect(() => {
        if (id) dispatch(fetchArticleByIdAction(id))
    }, [id])

    useEffect(() => {
        setValues({
            ghostUrl: selectedArticle?.ghostUrl ?? '',
            mediumlUrl: selectedArticle?.mediumlUrl ?? '',
        })
    }, [selectedArticle])

    const uploadToMedium = () => {
      dispatch(
          fetchUploadToMedium({
              id,
          }),
      )
  }

  const uploadToGhost = () => {
    dispatch(
        fetchUploadToGhost({
            id,
        }),
    )
}
  
    return (
        <CustomModal
            open={open}
            dropCallback={handleClose}
            label={`Share article #${id}`}
            loading={isLaoding}
        >
            <SharedContainer>
                <div className='line'>
                    <h1>Medium url</h1>
                    {values.mediumlUrl ? (
                        <a className='link'target='_blank' rel="noreferrer" href={values.mediumlUrl}>{values.mediumlUrl}</a>
                    ) : (
                        <Button loading={isLaoding} disabled={isLaoding} onClick={uploadToMedium}>Upload</Button>
                    )}
                </div>
                <div className='line'>
                    <h1 className='header'>Ghost url</h1>
                    {values.ghostUrl ? (
                        <a className='link' target='_blank' rel="noreferrer" href={values.ghostUrl}>{values.ghostUrl}</a>
                    ) : (
                        <Button loading={isLaoding} disabled={isLaoding} onClick={uploadToGhost}>Upload</Button>
                    )}
                </div>
            </SharedContainer>
        </CustomModal>
    )
}
export default ShareArticleModal
