from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import SignUpSerializer


class SignUpAPIView(APIView):
    # view used to sign up a new user using the REST API
    def post(self, request, *args, **kwargs):
        # creates a new user in the database if the request is valid
        # @param request: sign-up form data
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(serializer.data)
